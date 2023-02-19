import type { 
  LoaderFunction, 
  ActionFunction, 
} from "@remix-run/server-runtime";
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  Form,
  useLoaderData,
  useActionData,
  useSearchParams
} from "@remix-run/react";
import { useState } from "react";

import Cover from "~/components/cover";
import Container from "~/components/container";

import { getUserData, createUserSession, signInUser, signUpUser } from '~/utils/session.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUserData>>;
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: any) {
  let urls = ["/"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
}

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = validateUrl(
    form.get("redirectTo") || "/"
  );
  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      const user = await signInUser({username, password})

      if (!user) {
        return badRequest({
          fields,
          formError: `Username/Password combination is incorrect`,
        });
      }

      return createUserSession(user, redirectTo)
    }
    case "register": {
      const user = await signUpUser({username, password})
      if (!user) {
        return badRequest({
          fields,
          formError: `something went wrong`,
        });
      }
      return createUserSession(user, redirectTo)
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export const loader:LoaderFunction = async ({ request }) => {
  const user = await getUserData(request);

  const data: LoaderData = {
    user,
  };
  return json(data);
};

const Index:React.FC = () => {
  const [searchParams] = useSearchParams()
  const actionData = useActionData<ActionData>();
  const { user } = useLoaderData();
  const [formType, setFormType] = useState("login")

  return (
    <>
      <Cover title={"Login / Register"} />
      <Container className="p-12">
      <div className="container">
        <div className="content login-form">
            { user ? (
              <div className="user-info">
              <span>{`Hi ${user.displayName}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>) :(
                <Form method="post">
                <input
                  type="hidden"
                  name="redirectTo"
                  value={
                    searchParams.get("redirectTo") ?? undefined
                  }
                />
                <fieldset>
                  <legend className="sr-only">
                    Login or Register?
                  </legend>
                  <label className={formType === "login" ? "border-light-alt border-b-4" : ''}>
                    <input
                      type="radio"
                      name="loginType"
                      value="login"
                      onChange={() => setFormType("login")}
                      defaultChecked={
                        !actionData?.fields?.loginType ||
                        actionData?.fields?.loginType === "login"
                      }
                    />{" "}
                    Login
                  </label>
                  <label className={formType === "register" ? "border-light-alt border-b-4" : ''}>
                    <input
                      type="radio"
                      name="loginType"
                      value="register"
                      onChange={() => setFormType("register")}
                      defaultChecked={
                        actionData?.fields?.loginType ===
                        "register"
                      }
                    />{" "}
                    Register
                  </label>
                </fieldset>
                <div>
                  <label htmlFor="username-input">Username</label>
                  <input
                    className="mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="text"
                    id="username-input"
                    name="username"
                    defaultValue={actionData?.fields?.username}
                    aria-invalid={Boolean(
                      actionData?.fieldErrors?.username
                    )}
                    aria-errormessage={
                      actionData?.fieldErrors?.username
                        ? "username-error"
                        : undefined
                    }
                  />
                  {actionData?.fieldErrors?.username ? (
                    <p
                      className="form-validation-error"
                      role="alert"
                      id="username-error"
                    >
                      {actionData.fieldErrors.username}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="password-input">Password</label>
                  <input
                    className="mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="password-input"
                    name="password"
                    defaultValue={actionData?.fields?.password}
                    type="password"
                    aria-invalid={
                      Boolean(
                        actionData?.fieldErrors?.password
                      ) || undefined
                    }
                    aria-errormessage={
                      actionData?.fieldErrors?.password
                        ? "password-error"
                        : undefined
                    }
                  />
                  {actionData?.fieldErrors?.password ? (
                    <p
                      className="form-validation-error"
                      role="alert"
                      id="password-error"
                    >
                      {actionData.fieldErrors.password}
                    </p>
                  ) : null}
                </div>
                <div id="form-error-message">
                  {actionData?.formError ? (
                    <p
                      className="form-validation-error"
                      role="alert"
                    >
                      {actionData.formError}
                    </p>
                  ) : null}
                </div>
                <button type="submit" className="flex w-full items-center justify-center rounded-md border border-transparent px-3 py-3 mt-5 text-base font-medium hover:bg-dark hover:text-white md:text-lg">
                  {formType === "register" ? 'Register' : 'Login'}
                </button>
              </Form>
            ) }
          </div>
        </div>
      </Container>
    </>
  );
}

export default Index
