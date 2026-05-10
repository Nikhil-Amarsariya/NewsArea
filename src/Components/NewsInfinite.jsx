import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";

import NewsItem from "./NewsItem";
import SkeletonCard from "./SkeletonCard";

class NewsInfinite extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      page: 1,
      totalResults: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState(
        {
          page: 1,
          articles: [],
        },
        () => {
          this.fetchNews();
        }
      );
    }
  }

  // FETCH INITIAL NEWS

  fetchNews = async () => {
    try {
      this.props.setProgress?.(10);

      const { country, category, pageSize } = this.props;
      const { page } = this.state;

      this.setState({ loading: true });

      // CALL YOUR NETLIFY FUNCTION
      const url = `/.netlify/functions/news?category=${category}&country=${country}&page=${page}&pageSize=${pageSize}`;

      this.props.setProgress?.(40);

      const response = await fetch(url);

      this.props.setProgress?.(70);

      const parsedData = await response.json();

      this.props.setProgress?.(100);

      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalArticles || 0,
        loading: false,
      });

    } catch (error) {
      console.error("Fetch News Error:", error);

      this.setState({
        loading: false,
      });
    }
  };

  // FETCH MORE NEWS FOR INFINITE SCROLL

  fetchMoreData = async () => {
    try {
      const nextPage = this.state.page + 1;

      const { country, category, pageSize } = this.props;

      const url = `/.netlify/functions/news?category=${category}&country=${country}&page=${nextPage}&pageSize=${pageSize}`;

      const response = await fetch(url);

      const parsedData = await response.json();

      this.setState({
        page: nextPage,

        articles: this.state.articles.concat(
          parsedData.articles || []
        ),

        totalResults: parsedData.totalArticles || 0,
      });

    } catch (error) {
      console.error("Infinite Scroll Error:", error);
    }
  };

  render() {
    return (
      <>
        {/* HEADING */}

        <div className="d-flex justify-content-center">
          <h2 className="news-heading text-capitalize">
            NewsArea -
            {this.props.category === "general"
              ? " Home"
              : ` ${this.props.category}`}{" "}
            Headlines
          </h2>
        </div>

        {/* INITIAL LOADING */}

        {this.state.loading && (
          <div className="container">
            <div className="row">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </div>
          </div>
        )}

        {/* NEWS */}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={
            this.state.articles.length <
            this.state.totalResults
          }
          loader={
            <div className="container">
              <div className="row">
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            </div>
          }
          endMessage={
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <b>No more news</b>
            </p>
          }
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((article) => (
                <div
                  className="col-md-4 mb-4"
                  key={article.url}
                >
                  <NewsItem
                    title={article.title}
                    description={article.description}
                    imageUrl={article.image}
                    newsUrl={article.url}
                    author={
                      article.source?.name || "Unknown"
                    }
                    publishedAt={article.publishedAt}
                    source={
                      article.source?.name || "Unknown"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default NewsInfinite;