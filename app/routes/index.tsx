import { Link } from "@remix-run/react"
import Cover from "~/components/cover";
import Container from "~/components/container";
import { LayoutItem } from "~/components/LayoutItem";
import { Chicken, Eggs, Pork, Vegetables } from "~/svg";


const Index:React.FC = () => {

  return (
    <>
      <Cover title="Barbell Farm" />
      <Container className="p-12">
        <section>
          <h2 className="text-4xl mb-4">
            About Us
          </h2>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <h3 className="text-xl mb-2">Food for people, not for profit</h3>
              <p>All people have a fundamental right to choose regarding what they eat, where their food comes from, how it?s grown etc. Every decision we make is based on our goal of connecting people with their food by making it more accessible, affordable, transparent, and democratic rather than more profitable.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Community capital, not capital gains</h3>
              <p>Too much of our capital flows out of local economies and into the hands of international corporations, where it is either hoarded or distributed unequally. Whether by banking at local credit unions or sourcing our feed and chicks, we pay extra attention to every part of our supply chain to ensure that the capital we invest in our means of production stays in our community.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Local food systems, not profit centers</h3>
              <p>Industrial and centralized food systems are not only ecologically damaging, fragile but also inherently exploitative. Through careful attention to sourcing and non-GMO feed, we take every step that we see to work toward building and maintaining sustainable local food systems.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2">One bad day, not a bad life</h3>
              <p>We pour hours of care and love into our birds, and when they are old enough to be out from under the heat light, they get to live outside, 100% on beautiful pasture grass, protected by mobile shelters and electric netting.</p>
            </div>
            <div>
            <h3 className="text-xl mb-2">Working with Nature, not fighting it</h3>
            <p>We take pride and responsibility in our management of the pasture. We are committed to ensuring the health of the grass and soil so that it can continue to sequester carbon from the atmosphere and provide a healthy foundation for our sustainable food systems.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Education, not competition</h3>
              <p>Every day is a learning process for us. We learn from others, from educators, from our community, but mostly from our mistakes. As we learn, progress, and become more efficient, we want to share that knowledge about where food comes from and how its produced with our community, not hoard it as a competitive advantage to increase profits.</p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-4xl mb-4">
            What We Grow
          </h2>
            <ul className=" grid sm:grid-cols-4 gap-5">
              <LayoutItem>
                <div className="flex-none">
                  <Chicken />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mt-3">Poultry</h3>
                  <p> raised outside on pasture</p>
                </div>
              </LayoutItem>
              <LayoutItem>
                <Eggs />
                <div>
                  <h3 className="text-xl mb-3">Eggs</h3>
                  <p>Free ranging on pasture</p>
                </div>
              </LayoutItem>
              <LayoutItem>
                <div className="flex-none">
                  <Pork />
                </div>
                  <div>
                    <h3 className="text-xl mb-3">Pork</h3>
                    <p>raised outside on pasture</p>
                  </div>
              </LayoutItem>
              <LayoutItem>
                <Vegetables />
                <div>
                  <h3 className="text-xl mb-2">Vegetables</h3>
                  <p>grown w/o chemicals</p>
                </div>
              </LayoutItem>
            </ul>
            <div className="text-center mt-10">
              <Link className="text-xl font-serif bold px-4 py-1 text-dark rounded-full border border-dark hover:text-white hover:bg-dark hover:border-transparent" to="/products">View Products</Link>
            </div>
        </section>
      </Container>
    </>
  );
}

export default Index
