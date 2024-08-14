import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticle] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const updateNews = async () => {

    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticle(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);

  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewMonkey`;
    updateNews();
  }, [])


  // handlePreviousClick = async () => {
  // setPage(page-1)
  // updateNews();
  // };
  // handleNextClick = async () => {
  // setPage(page+1)
  // updateNews();
  // };

  const fetchMoreData = async () => {
    
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticle(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults)
  };

  return (
    <>
      <h2 className="text-center" style={{ marginTop: "94px", marginBottom: "34px" }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)}{" "}
        Headlines
      </h2>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}>
        <div className="container">
          {/* console.log({page}) */}
          <div className="row mb-4">
            {articles.map((element, idx) => {
              return (
                <div className="col-md-4" key={idx}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 50) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    newsUrl={element.url}
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : "https://biztoc.com/cdn/800/og.png"
                    }
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="clearfix my-3">...</div> */}
      {/* <div className="fixed-bottom bg-light border-top border-dark"> */}
      {/* <div className="container d-flex justify-content-between my-3"> */}
      {/* <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePreviousClick}>{" "}&larr; Previous</button> */}
      {/* <button disabled={page + 1 >Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button> */}
      {/* </div> */}
      {/* </div> */}
    </>
  );
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
