import { useState, useEffect } from "react";
import "./App.css"
import Logo from './assets/like-svgrepo-com.svg'
import Logoselected from './assets/like-svgrepo-selected.svg'

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(parseInt(sessionStorage.getItem("pageNumber")) || 1);
  const [itemsSelected, setItemsSelected] = useState(JSON.parse(sessionStorage.getItem("selectedItems")) || []);

  const setSelection = (index) => {
    if (!itemsSelected.includes(index)) {
      const setSelectedItems = [...itemsSelected, index]
      sessionStorage.setItem("selectedItems", JSON.stringify(setSelectedItems))
      setItemsSelected(setSelectedItems)
    }
  }

  useEffect(() => {
    const fetchData = (num) => {
      fetch("https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=10&page=" + num, {
        method: "GET",
        headers: {
          "User-Agent": "https://github.com/karunaswapnasree/techship",
        }
      }).then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      }).then(
        (result) => {
          setIsLoaded(true)
          setItems(result.items)
          sessionStorage.setItem("pageNumber", num);
        },
        (error) => {
          setIsLoaded(true);
          setError("You have Exceeded the search limits. Please Close the browser and try again.");
        }
      )
    }
    fetchData(page)
  }, [page])

  const nextButton = () => {
    setIsLoaded(false);
    setPage(page + 1)
  }
  const prevButton = () => {
    setIsLoaded(false);
    setPage(page - 1)
  }

  if (error) {
    return <div className="loader App errorText">Error: {error}</div>
  } else if (!isLoaded) {
    return <h1 className="loader App">Loading...</h1>
  } else {
    return (
      <div>
        <div className="header-text">
          <h1>Git Hub Repo Page {page} Results</h1>
          <div>
            <button className="prevBtn" disabled={page === 1} onClick={() => prevButton()}>Previous</button>
            <button className="nextBtn" onClick={() => nextButton()}>Next</button>
          </div>
        </div>
        <ul>
          <li><div className="textAlign">{items.length} Results per page {itemsSelected.length > 0 ? <span className="rightAlign">Total of {itemsSelected.length} Repos liked</span> : ""}</div> </li>
          {items.length > 0 ? (
            items.map(item => (
              <li key={item.node_id}>
                <div className="repoItem">
                  <div className="avatarContainer"><img src={item.owner.avatar_url} alt="Avatar" className="avatar" /></div>
                  <div className="fullName">
                    <div>{item.full_name}</div>
                    <div>Description: {item.description}</div>
                  </div>
                  <div className="avatarContainer"><span onClick={() => setSelection(item.node_id)}><img className="like" src={itemsSelected.includes(item.node_id) ? Logoselected : Logo} alt="Kiwi standing on oval" />
                  </span></div>
                </div>
              </li>
            ))
          ) : <li><div className="repoItem">No records found</div></li>}
        </ul>
      </div >
    );
  }
}
