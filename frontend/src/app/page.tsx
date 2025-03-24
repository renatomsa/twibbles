import Image from 'next/image'
import Post from '../components/feed/post'
import Head from 'next/head'

export default function Home() {
  return (
    <main>
      <Post user_name='Sexo' post_text='SEXO ANIMAL'/>
    </main>
  )
}
