import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import SkeletonCard from "./SkeletonCard";

class NewsInfinite extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 10,
    category: "top",
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
      nextPage: null,
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
          nextPage: null,
        },
        () => this.fetchNews()
      );
    }
  }

  // Remove duplicate articles
  removeDuplicates = (articles) => {
    return articles.filter(
      (article, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.title?.trim().toLowerCase() ===
              article.title?.trim().toLowerCase() ||
            a.description?.trim().toLowerCase() ===
              article.description?.trim().toLowerCase() ||
            a.image_url === article.image_url
        )
    );
  };

  fetchNews = async () => {
    try {
      const { country, category, pageSize } = this.props;

      this.setState({ loading: true });

      const url = `https://newsdata.io/api/1/latest?apikey=${
        import.meta.env.VITE_NEWSDATA_API
      }&country=${country}&category=${category}&language=en&size=${pageSize}`;

      this.props.setProgress(30);

      const data = await fetch(url);

      this.props.setProgress(70);

      const parsedData = await data.json();

      this.props.setProgress(100);

      const articles = Array.isArray(parsedData.results)
        ? parsedData.results
        : [];

      const filteredArticles = this.removeDuplicates(
        articles
      );

      this.setState({
        articles: filteredArticles,
        nextPage: parsedData.nextPage || null,
        loading: false,
      });
    } catch (error) {
      console.log("Fetch Error:", error);

      this.setState({
        loading: false,
      });
    }
  };

  fetchMoreData = async () => {
    try {
      if (!this.state.nextPage) return;

      const { country, category, pageSize } = this.props;

      const url = `https://newsdata.io/api/1/latest?apikey=${
        import.meta.env.VITE_NEWSDATA_API
      }&country=${country}&category=${category}&language=en&size=${pageSize}&page=${this.state.nextPage}`;

      const data = await fetch(url);

      const parsedData = await data.json();

      const newArticles = Array.isArray(
        parsedData.results
      )
        ? parsedData.results
        : [];

      const allArticles = [
        ...this.state.articles,
        ...newArticles,
      ];

      const filteredArticles = this.removeDuplicates(
        allArticles
      );

      this.setState({
        articles: filteredArticles,
        nextPage: parsedData.nextPage || null,
      });
    } catch (error) {
      console.log("Load More Error:", error);
    }
  };

  render() {
    return (
      <>
        <div className="d-flex justify-content-center">
          <h2 className="news-heading text-capitalize">
            NewsArea -
            {this.props.category === "top"
              ? " Home"
              : ` ${this.props.category}`}{" "}
            Headlines
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
          hasMore={this.state.nextPage !== null}
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
              {Array.isArray(this.state.articles) &&
                this.state.articles
                  .filter(
                    (article) =>
                      article.title &&
                      article.description
                  )
                  .map((article, index) => (
                    <div
                      className="col-md-4"
                      key={article.link || index}
                    >
                      <NewsItem
                        title={article.title}
                        description={
                          article.description
                        }
                        imageUrl={
                          article.image_url &&
                          article.image_url.startsWith(
                            "http"
                          )
                            ? article.image_url
                            : "/news-placeholder.svg"
                        }
                        newsUrl={article.link}
                        author={
                          article.creator?.[0] ||
                          "Unknown"
                        }
                        publishedAt={article.pubDate}
                        source={
                          article.source_id ||
                          "News Source"
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