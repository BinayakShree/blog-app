export default function About() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-8">

      <section className="bg-teal-600 dark:bg-teal-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-lg mb-8">
            Discover more about me and my journey, and learn about my skills and expertise.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Hello, I'm BinayakShree
            </h2>
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              I’m a teen with a passion for tech. Currently in high school, I am nurturing my skills in web development. I love exploring new technologies and applying them to real-world problems. My goal is to continually grow and challenge myself in the ever-evolving world of tech.
            </p>
          </div>
          <div className="lg:w-1/2 flex flex-wrap justify-center gap-6">
  
            <img
              src="https://avatars.githubusercontent.com/u/146093014?v=4"
              alt="Profile 1"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <img
              src="https://scontent.fktm21-1.fna.fbcdn.net/v/t39.30808-6/345880389_701420018449872_6566163613955409241_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=BC7YGrsxoEAQ7kNvgHi6N_O&_nc_ht=scontent.fktm21-1.fna&oh=00_AYDWAgSWvr8kr78W1uDNl51G9BpkjKCTuS3DJOEiAypBJA&oe=66C8BDD5"
              alt="Profile 2"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <img
              src="https://pbs.twimg.com/profile_images/1825443531600830464/wzIb5lOJ.jpg"
              alt="Profile 3"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
            Skills & Experience
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-64 text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Frontend Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Proficient in React and Next.js, creating dynamic and responsive web interfaces.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-64 text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Backend Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experience with Express and Hono for building robust server-side applications & various Auth methods like cookies,token,3rd Party OAuth and more.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-64 text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Database Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Knowledge of SQL and MongoDB for managing and querying databases. Prisma as ORM for making scalabe apps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
