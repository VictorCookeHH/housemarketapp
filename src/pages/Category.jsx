import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"

const Category = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const { categoryName } = useParams()
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingsRef = collection(db, "listings")
        const q = query(
          listingsRef,
          where("type", "==", categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        )
        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }
    fetchListing()
  }, [categoryName])

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings")
      const q = query(
        listingsRef,
        where("type", "==", categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      )
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      const listings = []
      querySnap.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() })
      })
      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error("Could not fetch listings")
    }
  }

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Places for {categoryName}</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {categoryName}</p>
      )}
    </div>
  )
}

export default Category