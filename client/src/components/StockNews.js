import React, { Component } from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import {
    NEWS_KEY
} from '../config/keys';
import axios from 'axios';


class StockNews extends Component {
    state = {
        news: []
    };

    addHeadlines = (articles) => {
        articles.forEach((article) => {

            let newArticle = {
                source: article.source.name,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url
            }

            this.setState(state => ({
                news: [...state.news, newArticle]
            }));

        })
    };

    getNews = (news) => {
        const link = `https://newsapi.org/v2/top-headlines?sources=financial-post&apiKey=${NEWS_KEY}`;
        axios
            .get(link)
            .then(news => {
                const articles = news.data.articles.slice(0, 3);
                this.addHeadlines(articles)
            })
            .catch(err => console.log(err));

    }


    render() {

        const { news } = this.state;

        if (news.length <= 0) {
            this.getNews(news);
        }

        return (
                    <ListGroup id="news" className="stock-chart">
                        {news.map((article) => (
                            <ListGroupItem key={article.title} className="news-item">
                                <a href={article.url} target="_blank">
                                    {article.title} -  {article.author} </a>
                                    <small>{article.description} </small>
                            </ListGroupItem>
                        ))
                        }
                    </ListGroup>

        );
    }
}

export default StockNews;
