import { createCookieSessionStorage, redirect, json } from '@remix-run/node';

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import { collection, getDocs } from "firebase/firestore"; 
import { auth, db } from '~/utils/firebase.config';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

type Login = {
    username: string
    password: string
}

type Admin = {
  userId: string
}

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax', // to help with CSRF
    path: '/',
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
  },
});

export async function getUserSession(request:Request) {
    return await getSession(request.headers.get('Cookie'));
}

export async function signInUser ({username, password}:Login) {
  try {
    const user = await signInWithEmailAndPassword(auth, username, password)
    
    return user
  }
  catch (error) {
    console.log(error)
  };
}

export async function signUpUser({username, password}:Login) {
  try {
    const user = createUserWithEmailAndPassword(auth, username, password)
    return user
  } catch(error) {
    return error
  };
}

const userIsAdmin = async (userId:string):Promise<Boolean> => {
  const admins = await getDocs(collection(db, "admins"));
  return admins.docs.some((admin:any) => {
    return admin.data().userId === userId
  })
};

export async function getUserData(request: Request) {
  const user = auth.currentUser;
  const session = await getUserSession(request);
  const uid = await session.get("idToken");

  if (user !== null && user.uid === uid) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = session.get("email")
    const email = session.get("email");
    const isAdmin = session.get("isAdmin")

    return {
      uid,
      displayName,
      email,
      isAdmin
    }
  }

  return null
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  console.log(session)
  const userId = session.get("idToken");

  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function createUserSession(
  user: any,
  redirectTo: string
) {
  try {
    const session = await getSession();
    const isAdmin = await userIsAdmin(user.user.uid);

    session.set('idToken', user.user.uid);
    session.set('email', user.user.email);
    session.set('isAdmin',isAdmin);


    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json(
      {
        errorCode: 'session/create',
        errorMessage: 'Could not create session: ' + error,
      },
      {
        status: 500,
      }
    );
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  try {
    await signOut(auth)
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch(error) {
    console.log(error)
  }
}

export { getSession }