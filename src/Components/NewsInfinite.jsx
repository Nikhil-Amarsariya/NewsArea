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
      page: 1,
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
          page: 1,
          articles: [],
        },
        this.fetchNews
      );
    }
  }
  fetchNews = async () => {
    const { country, category, pageSize } = this.props;
    const { page } = this.state;

    this.setState({ loading: true });

    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=${pageSize}&apikey=${import.meta.env.VITE_GNEWS_API}`;

    this.props.setProgress(30);

    const data = await fetch(url);

    this.props.setProgress(70);

    const parsedData = await data.json();

    this.props.setProgress(100);

    this.setState({
      articles: parsedData.articles || [],
      totalResults: parsedData.totalResults || 0,
      loading: false,
    });
  };

  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;

    const { country, category, pageSize } = this.props;

    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=${pageSize}&apikey=${import.meta.env.VITE_GNEWS_API}`;

    const data = await fetch(url);

    const parsedData = await data.json();

    this.setState({
      articles: this.state.articles.concat(parsedData.articles || []),
      page: nextPage,
      totalResults: parsedData.totalResults || 0,
    });
  };
  render() {
    return (
      <>
        <div className="d-flex justify-content-center">
          <h2 className="news-heading text-capitalize">
            NewsArea -
            {this.props.category === "general"
              ? " Home"
              : ` ${this.props.category}`} Headlines
          </h2>
        </div>

        {this.state.loading && (
          <div className="row">
            {Array(3)
              .fill()
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        )}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={
            <div className="row">
              {Array(3)
                .fill()
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No more news</b>
            </p>
          }
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((article) => (
                <div className="col-md-4" key={article.url}>
                  <NewsItem
                    title={article.title}
                    description={article.description}
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    author={article.author}
                    publishedAt={article.publishedAt}
                    source={article.source.name}
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