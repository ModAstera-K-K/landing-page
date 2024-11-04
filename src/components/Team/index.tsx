import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";
import { getDictionary } from "@/app/[lang]/dictionaries";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Joshua Owoyemi",
    designation: "CEO",
    image: "/images/team/team-01.png",
    linkedinLink: "https://www.linkedin.com/in/joshua-owoyemi/",
  },
  {
    id: 2,
    name: "Tetsuro Mori",
    designation: "COO",
    image: "/images/team/team-02.png",
    linkedinLink: "https://www.linkedin.com/in/tetsuromori/",
  },
  {
    id: 3,
    name: "Vinyl Chintalapudi",
    designation: "CTO",
    image: "/images/team/team-03.png",
    linkedinLink: "https://www.linkedin.com/in/vinylch/",
  },
];

const Team = async ({ lang }: { lang: string }) => {
  const t =  await getDictionary(lang);
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            // subtitle="Our Team"
            title={t.team.title}
            paragraph={t.team.desc}
            width="640px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team, i) => (
            <SingleTeam key={i} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
