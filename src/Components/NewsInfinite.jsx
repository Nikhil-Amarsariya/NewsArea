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
  };

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      totalResults: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.props.setProgress(10);
    this.fetchNews();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState(
        {
          articles: [],
        },
        this.fetchNews
      );
    }
  }

  fetchNews = async () => {
    try {
      const { country, category, pageSize } = this.props;

      this.setState({ loading: true });

      const url = `https://corsproxy.io/?https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=${pageSize}&apikey=${import.meta.env.VITE_GNEWS_API}`;

      this.props.setProgress(30);

      const response = await fetch(url);

      this.props.setProgress(70);

      const parsedData = await response.json();

      this.props.setProgress(100);

      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalArticles || 0,
        loading: false,
      });

    } catch (error) {
      console.error("Fetch Error:", error);

      this.setState({
        loading: false,
      });
    }
  };

  fetchMoreData = async () => {
    // GNews free API has limited pagination support
    return;
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
              : ` ${this.props.category}`} Headlines
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

        {/* NEWS SECTION */}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={false}
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
              <b>No more news available</b>
            </p>
          }
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((article, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <NewsItem
                    title={article.title || "No Title"}
                    description={
                      article.description || "No Description Available"
                    }
                    imageUrl={article.image}
                    newsUrl={article.url}
                    author={article.source?.name || "Unknown"}
                    publishedAt={article.publishedAt}
                    source={article.source?.name || "Unknown"}
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