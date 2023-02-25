import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { toast } from "react-toastify"
import { db } from "../firebase.config"
import Spinner from "../components/Spinner"
import sharedIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
} from "swiper"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, EffectFade])
const Listing = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  return (
    <main>
      {loading && <Spinner />}
      {listing && (
        <>
          <Swiper
            // install Swiper modules
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="swiperSlideDiv"
                >
                  {" "}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="shareIconDiv"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success("Link Copied!", { autoClose: 1000 })
            }}
          >
            <img src={sharedIcon} alt="" />
          </div>
          <div className="listingDetails">
            <p className="listingName">
              {listing.name} -{" "}
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && " / Month"}
            </p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">
              for {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="discountPrice">
                $ {listing.regularPrice - listing.discountedPrice}
              </p>
            )}
            <ul className="listingDetailsList">
              <li>
                {`${listing.bedrooms} Bedroom${listing.bedrooms > 1 && "s"}`}
              </li>
              <li>
                {`${listing.bathrooms} Bathroom${listing.bathrooms > 1 && "s"}`}
              </li>
              <li>{listing.parking && "Parking Sport"}</li>
              <li>{listing.furnished && "Furnished"}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
              <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[listing.geoLocation.lat, listing.geoLocation.lng]}
                zoom={15}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[listing.geoLocation.lat, listing.geoLocation.lng]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {auth.currentUser?.uid !== listing.userRef && (
              <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                className="primaryButton"
              >
                Contact Landlord
              </Link>
            )}
          </div>
        </>
      )}
    </main>
  )
}

export default Listing
