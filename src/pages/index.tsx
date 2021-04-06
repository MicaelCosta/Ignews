import { GetStaticProps/* , GetServerSideProps */ } from 'next';
import Head from "next/head";
import { stripe } from '../services/stripe';
import { SubscribeButton } from "../components/SubscribeButton";

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>New about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

//SSR tela ficará sem carregamento até retornar
//SSR NEXT
//Somente funciona dentro de uma Page do Next
//Neste momento tudo será executado na camada do Node antes da camada do browser
/* export const getServerSideProps: GetServerSideProps = async () => {
  //Expand inclui as informações do produto
  const price = await stripe.prices.retrieve('price_1IdAmBJMvmPjplnNpA6n0Mnc', { 
    expand: ['product']
  });

  //Uma boa pratica é salvar os decimais no banco como centavos
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //preço vem em centavos
  }

  return { 
    props: {
      product
    }
  }
} */

//SSG NEXT
//Somente funciona dentro de uma Page do Next
//Neste momento tudo será executado na camada do Node (SSR), retorna para a camada do SSG antes da camada do browser
export const getStaticProps: GetStaticProps = async () => {
  //Expand inclui as informações do produto
  const price = await stripe.prices.retrieve('price_1IdAmBJMvmPjplnNpA6n0Mnc', { 
    expand: ['product']
  });

  //Uma boa pratica é salvar os decimais no banco como centavos
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //preço vem em centavos
  }

  return { 
    props: {
      product
    },
    revalidate: 60 * 60 * 24,//24 horas - Quanto tempo em segundos a pagina será reconstruida e gerada um novo static
  }
} 