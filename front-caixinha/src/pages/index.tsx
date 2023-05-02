import Head from 'next/head'
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/router'
import { getCaixinhas } from './api/api.service'
import Layout from '@/components/Layout'

export interface Caixinha {
  members: any[]
  currentBalance: number
  deposits: any[]
  loans: any[]
  id: string
}

export default function Home({ data }: any) {
  const router = useRouter()
  const caixinha: Caixinha = data[0]

  const join = () => {
    router.push({
      pathname: '/join',
      query: { id: caixinha.id },
    })
  }

  return (
    <Layout>
      <Head>
        <title>Caixinha</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Discord no Zap
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A primeira caixinha feita pelos amigos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              quantidade de membros nela {caixinha.members.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              valor disponivel na caixinha {caixinha.currentBalance}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={join} size="small">Juntar-se</Button>
          </CardActions>
        </Card>
      </main>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data = await getCaixinhas()
  return { props: { data } }
}