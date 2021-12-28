const PORT = process.env.PORT || 8000
const express = require("express")
const axios= require("axios")
const cheerio = require ("cheerio")

const newspapers = [
    {
        name: 'Theconversation',
        address: 'https://theconversation.com/ca/topics/poverty-717'
    },

    { name: 'theeconomictimes',
      address: 'https://economictimes.indiatimes.com/topic/poverty',
    },

    {name:'Guardian',
     address: 'https://www.theguardian.com/society/poverty'
    },

    {name: 'Nationalpost',
     address:'https://nationalpost.com/tag/poverty/'
    },

    {name: 'CBC',
     address:'https://www.cbc.ca/news/politics/child-poverty-report-2019-1.6260285'
    }


]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address,)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("poverty")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        })

    })
})


const app= express()

app.get('/', (req, res) => {
    res.json('Welcome to my Poverty Article API')
})

app.get('/news', (req, res) => {

    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))