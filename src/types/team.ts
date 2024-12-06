export type TeamType = {
  id: number;
  name: string;
  designation: string;
  image: string;
  linkedinLink: string;
  experience: {
    en: string[];
    jp: string[];
  };
};
