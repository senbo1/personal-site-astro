export interface Project {
  name: string;
  description: string;
  link: string;
}

export const Projects: Project[] = [
  {
    name: "twitter-clone",
    description: "Twitter Clone Made with Nextjs (IN PROGRESS)",
    link: "https://github.com/senbo1/twitter-clone"
  },
  {
    name: "shin",
    description: "A web app to see seasonal anime airing details and more",
    link: "https://github.com/senbo1/shin"
  },
  {
    name: "GPTussy",
    description: "A Discord bot that integrates OpenAI's GPT Models",
    link: "https://github.com/senbo1/GPTussy",
  },
  {
    name: "Algorithms",
    description: 'Implementation of common data structures & algorithms',
    link: "https://github.com/senbo1/Algorithms",
  }, 
  {
    name: "BookReviews",
    description: "Expressjs app to review books",
    link: "https://github.com/senbo1/BookReviews",
  }, 
  {
    name: "RESTful-API",
    description: "A RESTful API with JWT and Typescript",
    link: "https://github.com/senbo1/RESTful-API",
  }
]