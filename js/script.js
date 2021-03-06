{
  ('use strict');

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleAuthorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    articleTagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-links').innerHTML),
    tagAuthorLink: Handlebars.compile(document.querySelector('#template-author-links').innerHTML)
  }

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list';

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  /*generateTitleLinks*/

  const generateTitleLinks = function(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    console.log('titleList:', titleList);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(
      optArticleSelector + customSelector
    );
    console.log('articles:', articles);

    let html = '';

    for (let article of articles) {
      console.log('article:', article);

      /* get the article id */
      const articleId = article.getAttribute('id');
      console.log('articleId:', articleId);
      /* find the title element */

      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      console.log('articleTitle:', articleTitle);
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      //console.log('linkHTML:', linkHTML);
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* insert link into titleList */
      html = html + linkHTML;
      console.log('html:', html);
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    console.log('links=', links);

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  const calculateTagsParams = function (tags) {
    console.log('tagsParams:', calculateTagsParams);
    const params = {min: 999999, max: 0};
    for(let tag in tags){
      console.log(tag + ' is used ' + tags[tag] + ' times');
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function (count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);

    return optCloudClassPrefix + classNumber;
  };

  /*generateTags*/
  const generateTags = function () {
    /*[NEW] create a new variable allTags with an empty object*/
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    console.log('articles: ', articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      console.log('article: ', article);

      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      console.log('tagsWrapper ', tagsWrapper);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      console.log('articleTags: ', articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      console.log('articleTagsArray: ', articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        console.log('tag: ', tag);
        /* generate HTML of the link */
        //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        //console.log('linkHTML: ', linkHTML);
        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.articleTagLink(linkHTMLData);
        /* add generated code to html variable */
        /*[NEW] check if this link is NOT already in allTags*/
        if(!allTags[tag]){
          /*[NEW] add tag to allTags object*/
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        html = html + linkHTML;
        console.log('html: ', html);
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /*[NEW] find list of tags in right column*/
    const tagList = document.querySelector(optTagsListSelector);
    console.log('tagList:', tagList);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /*[NEW] create variable for all links HTML code*/
    //let allTagsHTML = '';
    let allTagsData = {tags: []};
    /*[NEW] START LOOP: for each tag in allTags:*/
    for(let tag in allTags){
      /*[NEW] generate code of a link and add it to allTagsHTML*/
      //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
     //const tagLinkHTML = '<li><a class ="'+ calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '" >' + tag + '</a></li>';
      //console.log('tagLinkHTML:', tagLinkHTML);
      allTagsData.tags.push({
        tag: tag,
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      //allTagsHTML += tagLinkHTML;
    /*[NEW] END LOOP: for each tag in allTags*/
    };
    /*[NEW] add HTML for allTagsHTML to tagList*/
    //tagList.innerHTML = allTagsHTML;
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  };

  generateTags();

  const tagClickHandler = function(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('Link was clicked!');
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    console.log('href: ', href);
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    console.log('tag: ', tag);
    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log('activeTags: ', activeTags);
    /* START LOOP: for each active tag link */
    for (let activeTag of activeTags) {
      console.log('activeTag: ', activeTag);
      /* remove class active */
      activeTag.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
    console.log('hrefTags: ', hrefTags);
    /* START LOOP: for each found tag link */
    for (let hrefTag of hrefTags) {
      console.log('hrefTag: ', hrefTag);
      /* add class active */
      hrefTag.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    console.log('tagLinks: ', tagLinks);
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  /*generateAuthors*/
  const generateAuthors = function() {
    /*[NEW] create a new variable allAuthors with an empty object*/
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    console.log('articles:', articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      console.log('articles:', articles);
      /* find author wrapper */
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      console.log('authorWrapper:', authorWrapper);
      /* make html variable with empty string */
      let html = '';
      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');
      console.log('author:', author);
      /* generate HTML of the link */
      //const linkHTML = '<a href="#author-' + author + '">' + author + '</a>';
      //console.log('linkHTML:', linkHTML);
      const linkHTMLData = {id: author, title: author};
      const linkHTML = templates.articleAuthorLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      console.log('html:', html);
      /*[NEW] check if this link is NOT already i allAuthors*/
      if(!allAuthors[author]) {
        /*[NEW] add author to allAuthors object*/
        allAuthors[author] = 1;
      } else {
        allAuthors[author] ++;
      }
      /* insert HTML of all the links into the author wrapper */
      authorWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /*[NEW] find list of authors in the right column*/
    const authorList = document.querySelector('.authors');
    /*[NEW] create variable for all links HTML code*/
    //let allAuthorsHTML = '';
    let allAuthorsData = {authors: []};
    /*[NEW] START LOOP: for each author in allAuthors:*/
    for(let author in allAuthors) {
      /*[NEW] generate code of a link and add it to allAuthorsHTML*/
      //const authorLinkHTML = '<li><a href="author-' + author + '">' + author + ' (' + allAuthors[author] + ')</a></li>';
      //console.log('authorLinkHTML:', authorLinkHTML);
      //allAuthorsHTML += authorLinkHTML;
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    /*[NEW] END LOOP: for each author in allAuthors*/
    }
    /*[NEW] add HMTL for allAuthorsHTML to authorList*/
    authorList.innerHTML = templates.tagAuthorLink(allAuthorsData);
  };

  generateAuthors();

  const authorClickHandler = function(event) {
    /*prevent default action for this event*/
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('Link was clicked!');
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    console.log('href: ', href);
    /*make a new constant "author" and extract tag from the "href" constant*/
    const author = href.replace('#author-', '');
    console.log('author:', author);
    /* find all authors links with class active */
    const activeAuthors = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    console.log('activeAuthors:', activeAuthors);
    /* START LOOP: for each active author link */
    for (let activeAuthor of activeAuthors) {
      console.log('activeAuthors:', activeAuthors);
      /* remove class active */
      activeAuthor.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const hrefAuthors = document.querySelectorAll('a[href="' + href + '"]');
    console.log('hrefAuthors: ', hrefAuthors);
    /* START LOOP: for each found author link */
    for (let hrefAuthor of hrefAuthors) {
      console.log('hrefAuthor: ', hrefAuthor);
      /* add class active */
      hrefAuthor.classList.add('active');
      /* END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListnerToAuthors = function() {
    /*find all links to author*/
    const authorLinks = document.querySelectorAll('a[href^="author-"]');
    console.log('authorLinks:', authorLinks);
    /*START LOOP: for each link*/
    for (let authorLink of authorLinks) {
      /*add tagClickHandler as event listner for that link*/
      authorLink.addEventListener('click', authorClickHandler);
      /*END LOOP: for each link*/
    }
  };
  addClickListnerToAuthors();
}