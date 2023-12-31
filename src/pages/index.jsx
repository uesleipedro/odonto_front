import Head from 'next/head'
import Header from '../components/Header'
import TopCards from '../components/TopCards'
import BarChart from '../components/BarChart'
import RecentOrders from '../components/RecentOrders'

export default function Home() {

  return (
    <>
      <Head>
        <title>Odonto Solution</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='bg-gray-100'>
        {/* <Header /> */}
        <TopCards />
        <div className="grid md:grid-cols-3 grid-cols-1 ">
          <BarChart />
          <RecentOrders />
        </div>
      </main>
    </>
  )
}
