import Image from 'next/image'
import { Fantasy } from './components/fantasy'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24" style={{position: 'relative'}}>
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Zinger Fantasy Football 2023
        </p>
      </div>

      <Fantasy />

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://fantasy.espn.com/football/league/scoreboard?leagueId=884074"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image className="espn_logo" src="/shield-full-500.png" height={50} width={50} alt='espn-shield'/>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Zinger Scoreboard{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Head over to ESPN to see more in-depth statistics.
          </p>
        </a>
      </div>
    </main>
  )
}
