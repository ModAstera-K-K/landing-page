import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

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

const Team = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            // subtitle="Our Team"
            title="Meet Our Team"
            paragraph="Our team consists of passionate AI engineers, data scientists and visionaries passionate about revolutionizing healthcare through innovative technology. Leveraging advanced machine learning, data analytics, and cutting-edge technology, we strive to create innovative solutions that enhance patient care and streamline healthcare processes."
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
