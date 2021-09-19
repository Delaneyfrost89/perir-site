import Head from 'next/head'
import Image from 'next/image'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

import Container from '@components/Container'
import Button from '@components/Button'
import styles from '@styles/Product.module.scss'

export default function Home({ photo }) {
  console.log(photo)
  return (
    <>
      <Head>
        <title>{photo.title} | P&eacute;rir Photography</title>
      </Head>

      <Container>
        <div className={styles.photoWrapper}>
          <div className={styles.photoImage}>
            <Image
              src={photo.featuredImage.sourceUrl}
              alt={photo.featuredImage.altText}
              width={photo.featuredImage.mediaDetails.width}
              height={photo.featuredImage.mediaDetails.height}
            />
          </div>
          <div className={styles.photoContent}>
            <h2>{photo.title}</h2>
            {photo.collections.edges.map(({ node }) => {
              return <h3 key={node.id}>{node.name}</h3>
            })}
            {photo.filmTypes.edges.map(({ node }) => {
              return <p key={node.id}>{node.name}</p>
            })}
            <p className={styles.photoPrice}>${photo.price.photoPrice}</p>
            <Button
              className='snipcart-add-item'
              data-item-id={photo.id}
              data-item-price={photo.price.photoPrice}
              data-item-url='/'
              data-item-description={`${photo.title} photography.`}
              data-item-image={photo.featuredImage.sourceUrl}
              data-item-name={photo.title}
              data-time-max-quantity={1}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps({ params }) {
  const { photoSlug } = params

  const client = new ApolloClient({
    uri: 'https://cms.perirphotography.com/graphql',
    cache: new InMemoryCache(),
  })

  const res = await client.query({
    query: gql`
      query SinglePhotoBySlug($slug: ID!) {
        photo(id: $slug, idType: SLUG) {
          id
          slug
          title
          photoId
          filmTypes {
            edges {
              node {
                name
              }
            }
          }
          price {
            photoPrice
          }
          featuredImage {
            node {
              altText
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
          collections {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    `,
    variables: {
      slug: photoSlug,
    },
  })

  const photo = {
    ...res.data.photo,
    ...res.data.photo,
    featuredImage: {
      ...res.data.photo.featuredImage.node,
    },
  }

  return {
    props: {
      photo,
    },
  }
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: 'https://cms.perirphotography.com/graphql',
    cache: new InMemoryCache(),
  })

  const res = await client.query({
    query: gql`
      query AllPhotos {
        photos {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `,
  })

  const paths = res.data.photos.edges.map(({ node }) => {
    return {
      params: {
        photoSlug: node.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}
