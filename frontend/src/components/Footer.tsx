import { Footer } from "flowbite-react";
import {  BsFacebook, BsGithub, BsInstagram, BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function FooterComponent() {
  return (
    <div>
      <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-cols-1">
            <div className="mt-5">
              <Link to="/">
                <img
                  src="https://avatars.githubusercontent.com/u/146093014?v=4&size=64"
                  alt="Profile"
                  className="rounded-full"
                />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col>
                  <Link to="/projects">
                    <Footer.Link  as={'div'} href="">Projects</Footer.Link>
                  </Link>
                  <Link to="/about">
                    <Footer.Link  as={'div'} href="">About</Footer.Link>
                  </Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Follow Me" />
                <Footer.LinkGroup col>
                  <Link to="https://github.com/BinayakShree" target="_blank" rel="noopener noreferrer">
                    <Footer.Link  as={'div'} href="">Github</Footer.Link>
                  </Link>
                  <Link to="https://www.instagram.com/binayak_shree/" target="_blank" rel="noopener noreferrer">
                    <Footer.Link  as={'div'} href="">Instagram</Footer.Link>
                  </Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright
              href="#"
              by="BinayakShree"
              year={new Date().getFullYear()}
            />
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
                href="https://www.facebook.com/binayakshree/"
                  target="_blank"
                rel="noopener noreferrer"
                icon={BsFacebook}
              />
              <Footer.Icon
                href="https://www.instagram.com/binayak_shree/"
                  target="_blank"
                rel="noopener noreferrer"
                icon={BsInstagram}
              />
              <Footer.Icon href="https://x.com/BinayakShree" target="_blank" rel="noopener noreferrer" icon={BsTwitterX} />
              <Footer.Icon
                href="https://github.com/BinayakShree"
                target="_blank"
                rel="noopener noreferrer"
                icon={BsGithub}
              />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
