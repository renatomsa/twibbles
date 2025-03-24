import Image from 'next/image'
import Post from '../components/feed/post'
import Head from 'next/head'

export default function Home() {
  return (
    <main>
      <Post user_name='Max Stenio' post_text='Matéria  de Goalkeeper tá complicada, acho que vou ter que usar o modo estudo'/>
    </main>
  )
}
