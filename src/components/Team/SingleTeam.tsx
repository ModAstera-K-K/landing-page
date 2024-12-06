import { TeamType } from "@/types/team";
import Image from "next/image";
import DotPattern from "../Common/DotPattern";

const SingleTeam = ({ team, lang }: { team: TeamType; lang: string }) => {
  const { image, name, designation, linkedinLink, experience } = team;
  const experienceDisplay = lang === "en" ? experience.en : experience.jp;
  return (
    <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
      <div className=" group mb-8 rounded-xl bg-white px-5 pb-10 pt-12 shadow-testimonial dark:bg-dark dark:shadow-none">
        <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
          <Image
            src={image}
            alt={name}
            className="w-full rounded-full"
            width={120}
            height={120}
          />
          <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
          <span className="absolute right-0 top-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
            <DotPattern />
          </span>
        </div>
        <div className="text-center">
          <h3 className="mb-1 text-lg font-semibold text-dark dark:text-white">
            {name}
          </h3>
          <p className="mb-5 text-sm text-body-color dark:text-dark-6">
            {designation}
          </p>
          <div className="flex h-40 flex-col gap-1">
            {experienceDisplay.map((exp, i) => (
              <p
                key={i}
                className="mb-0 text-sm text-body-color dark:text-dark-6"
              >
                {exp}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-center gap-5">
            <a
              aria-label="social link"
              href={linkedinLink}
              className="text-dark-6 hover:text-primary"
            >
              <svg
                width="48"
                height="48"
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                viewBox="0 0 48 48"
                enable-background="new 0 0 48 48"
              >
                <g>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#007BB5"
                    d="M21,33.6h4v-6.4c0-1.7,0.3-3.3,2.4-3.3 c2.1,0,2.1,1.9,2.1,3.4v6.3h4v-7.1c0-3.5-0.8-6.2-4.8-6.2c-2,0-3.3,1.1-3.8,2.1h-0.1v-1.8H21V33.6z M16.4,14.1 c-1.3,0-2.3,1-2.3,2.3c0,1.3,1,2.3,2.3,2.3c1.3,0,2.3-1,2.3-2.3C18.8,15.2,17.7,14.1,16.4,14.1L16.4,14.1z M14.4,33.6h4v-13h-4 V33.6z M9.8,40c-1,0-1.8-0.8-1.8-1.8V9.8C8,8.8,8.8,8,9.8,8h28.5c1,0,1.8,0.8,1.8,1.8v28.5c0,1-0.8,1.8-1.8,1.8H9.8z"
                  />
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTeam;
