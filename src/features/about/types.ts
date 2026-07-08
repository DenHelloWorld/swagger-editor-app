export type LocalizedText = {
  en: string;
  ru: string;
};

export type TeamMember = {
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  githubUrl: string;
  linkedinUrl?: string;
};
