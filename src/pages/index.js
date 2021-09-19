import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Fuse from 'fuse.js'
import Container from '@components/Container'
import Button from '@components/Button'
import styles from '@styles/Home.module.scss'

export default function Home({ photos, collections }) {
  const [activeCollection, setActiveCollection] = useState()
  const [query, setQuery] = useState()

  let filteredPhotos = photos
  if (activeCollection) {
    filteredPhotos = filteredPhotos.filter(({ collections }) => {
      const collectionIds = collections.map(({ slug }) => slug)
      return collectionIds.includes(activeCollection)
    })
  }

  const fuse = new Fuse(photos, {
    keys: ['title', 'collections.name'],
  })

  if (query) {
    const results = fuse.search(query)
    filteredPhotos = results.map(({ item }) => item)
  }

  function handleOnSearch(event) {
    const value = event.currentTarget.value
    setQuery(value)
  }
  console.log(collections)
  return (
    <Container>
      <h1 className='sr-only'>Perir Photography</h1>
      <h2 className='sr-only'>Available Photos</h2>
      <div className={styles.discover}>
        <div className={styles.collections}>
          <h2>Filter by Collection</h2>
          <ul>
            {collections.map((collection) => {
              const isActive = collection.id === activeCollection
              let collectionClassName
              if (isActive) {
                collectionClassName = styles.collectionIsActive
              }
              console.log(collection)
              return (
                <li key={collection.id}>
                  <Button
                    className={collectionClassName}
                    onClick={() => setActiveCollection(collection.slug)}
                  >
                    {collection.name}
                  </Button>
                </li>
              )
            })}
            <li>
              <Button
                className={!activeCollection && styles.collectionIsActive}
                onClick={() => setActiveCollection(undefined)}
              >
                View All
              </Button>
            </li>
          </ul>
        </div>
        {/* <div className={styles.search}>
          <h2>Search</h2>
          <form>
            <input type='search' onChange={handleOnSearch} />
          </form>
        </div> */}
      </div>

      <ul className={styles.photos}>
        {filteredPhotos.map((photo) => {
          return (
            <li className={styles.photoCard} key={photo.id}>
              <Link href={`/photos/${photo.slug}`}>
                <a>
                  <div className={styles.photoImage}>
                    <Image
                      src={photo.featuredImage.sourceUrl}
                      alt={photo.featuredImage.altText}
                      width={photo.featuredImage.mediaDetails.width}
                      height={photo.featuredImage.mediaDetails.height}
                    />
                  </div>
                </a>
              </Link>
              <div className={styles.cardDetails}>
                <h3 className={styles.photoTitle}>{photo.title}</h3>
                <p className={styles.photoPrice}>${photo.price.photoPrice}</p>

                <Button
                  width='full'
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
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

export async function getStaticProps() {
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
              featuredImage {
                node {
                  mediaDetails {
                    height
                    width
                  }
                  sourceUrl
                  altText
                }
              }
              title
              slug
              uri
              price {
                photoPrice
              }
              collections {
                edges {
                  node {
                    id
                    slug
                    name
                  }
                }
              }
            }
          }
        }
        collections {
          edges {
            node {
              slug
              id
              name
            }
          }
        }
      }
    `,
  })

  const photos = res.data.photos.edges.map(({ node }) => {
    const data = {
      ...node,
      ...node.photos,
      featuredImage: { ...node.featuredImage.node },
      collections: node.collections.edges.map(({ node }) => node),
    }
    return data
  })

  const collections = res.data.collections.edges.map(({ node }) => node)

  return {
    props: {
      photos,
      collections,
    },
  }
}
