import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";
import { getDictionary } from "@/app/[lang]/(landing)/dictionaries";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Joshua Owoyemi",
    designation: "CEO",
    image: "/images/team/team-01.png",
    linkedinLink: "https://www.linkedin.com/in/joshua-owoyemi/",
    experience: {
      en: [
        "PhD in System Information Science, Tohoku University",
        "4 years at a Biotech AI startup",
        "Built generative models for enterprise drug discovery application achieving $1M ARR",
      ],
      jp: [
        "東北大学大学院システム情報科学研究科博士課程修了",
        "バイオテックAIスタートアップで4年間勤務",
        "創薬におけるエンタープライズアプリケーションのためのジェネレーティブモデルを構築し、ARR100万ドルを達成",
      ],
    },
  },
  {
    id: 2,
    name: "Tetsuro Mori",
    designation: "COO",
    image: "/images/team/team-02.png",
    linkedinLink: "https://www.linkedin.com/in/tetsuromori/",
    experience: {
      en: [
        "MBA | BSc in Computer Science",
        "Promotion and marketing expert",
        "Ex-CTO - Computer Vision Startup",
        "Ex-PM at Rakuten USA",
        "Ex-Zozosuit engineer at Zozo",
      ],
      jp: [
        "MBA、コンピューターサイエンス学士",
        "エンタメ業界でセールスマーケティング",
        "元AIスタートアップCTO",
        "元楽天USAプロジェクトマネージャー",
        "元Zozosuitエンジニア",
      ],
    },
  },
  // {
  //   id: 3,
  //   name: "Vinyl Chintalapudi",
  //   designation: "CTO",
  //   image: "/images/team/team-03.png",
  //   linkedinLink: "https://www.linkedin.com/in/vinylch/",
  //   experience: {
  //     en: [
  //       "MSc in Information Science and Tech., The University of Tokyo",
  //       "Ex-AI/ML Engineer at Indeed",
  //       "Specialist in advanced Computer Vision and NLP techniques",
  //     ],
  //     jp: [
  //       "東京大学大学院情報理工学系研究科修士課程修了",
  //       "元Indeed社AI/MLエンジニア",
  //       "コンピュータビジョンとNLPのスペシャリスト",
  //     ],
  //   },
  // },
];

const Team = async ({ lang }: { lang: string }) => {
  const pageData = await getDictionary(lang);
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            // subtitle="Our Team"
            title={pageData.team.title}
            paragraph={pageData.team.desc}
            width="640px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team, i) => (
            <SingleTeam key={i} team={team} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
