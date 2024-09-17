'use client'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useQuery } from '@tanstack/react-query';

interface Project {
  fields: {
    description: string;
    github_url: string;
    walrus_site_url: string;
    id: string;
    name: string;
    video_blob_id: string;
    votes: number;
  };
  type: string;
}

export default function Home() {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

  const getRankList = async (): Promise<Project[]> => {
    const res: any = await client.getObject({
      id: `0x097affa9fd35bc136c9f54b6617fbb24655325694fd23271f7a7ed3b6bd98c6c`,
      options: {
        showContent: true,
        showType: true
      }
    });
    const projectList: Project[] = res.data.content.fields.project_list;
    console.log('test', projectList, projectList.sort((a, b) => b.fields.votes - a.fields.votes).length);
    
    return projectList.sort((a, b) => b.fields.votes - a.fields.votes);
  }

  const { data: rankList, isLoading, isError } = useQuery({
    queryKey: ['rankList'],
    queryFn: getRankList
  });

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen py-12 px-8 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)] overflow-y-auto">
      {isLoading && <p className="text-lg text-gray-600">Loading...</p>}
      {isError && <p className="text-lg text-red-600">Error loading, please try again later</p>}
      {rankList && (
        <ul className="w-full max-w-2xl space-y-4 mb-12">
          {rankList.map((project) => (
            <li key={project.fields.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{project.fields.name}</h2>
              <p className="text-gray-600 mb-2">Votes: <span className="font-semibold">{project.fields.votes}</span></p>
              <div className="flex space-x-4">
                <a href={project.fields.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">GitHub</a>
                <a href={project.fields.walrus_site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Walrus Site</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
