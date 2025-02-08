// Function to display error message
function msgError() {
  return "<span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span>";
}

// Function to display loader
function beforeLoader() {
  return "<div class=\"loader\"/>";
}

// Function to get feed URL
function getFeedUrl(type, count, label) {
  var url = '';
  switch (label) {
    case 'recent':
      url = '/feeds/posts/default?alt=json&max-results=' + count;
      break;
    case 'comments':
      url = "list1" == type ? "/feeds/comments/default?alt=json&max-results=" + count : '/feeds/posts/default/-/' + label + '?alt=json&max-results=' + count;
      break;
    default:
      url = "/feeds/posts/default/-/" + label + "?alt=json&max-results=" + count;
  }
  return url;
}

// Function to get post link
function getPostLink(data, index) {
  for (var i = 0; i < data[index].link.length; i++) {
    if ('alternate' == data[index].link[i].rel) {
      var link = data[index].link[i].href;
      break;
    }
  }
  return link;
}

// Function to get post title
function getPostTitle(data, index) {
  return data[index].title.$t;
}

// Function to get first image
function getFirstImage(html, src) {
  var img = $('<div>').html(html).find("img:first").attr("src") || '';
  var url = img.lastIndexOf('/', img.lastIndexOf('/') - 1);
  var [path, filename] = [img.substring(0, url), img.substring(img.lastIndexOf('/') + 1)];
  var size = img.match(/\/s[0-9]+|\/w[0-9]+/g);
  return path + (size[0] || '/w72-h72-p-k-no-nu-rw') + filename;
}

// Function to get post image
function getPostImage(data, index, link) {
  var content = data[index].content.$t;
  if (data[index].media$thumbnail) {
    var thumbnail = data[index].media$thumbnail.url;
  } else {
    thumbnail = "https://4.bp.blogspot.com/-eALXtf-Ljts/WrQYAbzcPUI/AAAAAAAABjY/vptx-N2H46oFbiCqbSe2JgVSlHhyl0MwQCK4BGAYYCw/s72-c/nth-ify.png";
  }
  return content.indexOf(content.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1 ? content.indexOf("<img") > -1 ? content.indexOf(content.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < content.indexOf("<img") ? thumbnail.replace('/default.', '/0.') : getFirstImage(content) : thumbnail.replace("/default.", '/0.') : content.indexOf("<img") > -1 ? getFirstImage(content) : "https://4.bp.blogspot.com/-eALXtf-Ljts/WrQYAbzcPUI/AAAAAAAABjY/vptx-N2H46oFbiCqbSe2JgVSlHhyl0MwQCK4BGAYYCw/s72-c/nth-ify.png";
}

// Function to get post author
function getPostAuthor(data, index) {
  var author = data[index].author[0].name.$t;
  if ("true" == messages.postAuthor) {
    var authorText = '' + author + '';
  } else {
    authorText = '';
  }
  return authorText;
}

// Function to get post date
function getPostDate(data, index) {
  var date = data[index].published.$t;
  var [month, day, year] = [date.substring(0, 4), date.substring(5, 7), date.substring(8, 10)];
  var monthName = monthFormat[parseInt(month, 10) - 1];
  var dateText = monthName + " " + day + ", " + year;
  if ("true" == messages.postDate) {
    var dateHtml = "<span class=\"entry-time\"><time class=\"published\" datetime=\"" + date + "\">" + dateText + "</time></span>";
  } else {
    dateHtml = '';
  }
  return dateHtml;
}

// Function to get post meta
function getPostMeta(author, date) {
  if ("true" == messages.postAuthor && "true" == messages.postDate) {
    var meta = "<div class=\"entry-meta\">" + author + date + "</div>";
  } else {
    meta = "true" == messages.postAuthor ? "<div class=\"entry-meta\">" + author + '</div>' : 'true' == messages.postDate ? "<div class=\"entry-meta\">" + date + '</div>' : '';
  }
  if ('true' == messages.postDate) {
    var metaHtml = "<div class=\"entry-meta\">" + date + "</div>";
  } else {
    metaHtml = '';
  }
  return [meta, metaHtml];
}

// Function to get post tag
function getPostTag(data, index) {
  if (null != data[index].category) {
    var tag = "<span class=\"labels-oius\">" + data[index].category[0].term + '</span>';
  } else {
    tag = '';
  }
  return tag;
}

// Function to get post summary
function getPostSummary(data, index, length) {
  if (data[index].content.$t) {
    var summary = data[index].content.$t;
    var trimmedSummary = $("<div>").html(summary).text().trim().substr(0, length) + "…";
  } else {
    summary = '';
  }
  return "<span class=\"entry-excerpt excerpt\">" + trimmedSummary + "</span>";
}

// Function to make AJAX call
function getAjax(element, type, count, label, errorLabel) {
  switch (type) {
    case "col-left":
    case "hero":
    case "layout2":
    case "layout3":
    case "layout4":
    case "layout5":
    case "myvideo":
    case "sidebar1":
    case "opinion":
    case "sevencard":
    case "flatsome":
    case "headermagazine":
    case 'list1':
    case "related":
      if (0 == count) {
        count = "geterror404";
      }
      var url = getFeedUrl(type, count, label);
      $.ajax({
        'url': url,
        'type': "GET",
        'dataType': "json",
        'cache': true,
        'beforeSend': function (xhr) {
          var parentId = element.parent().attr('id');
          switch (type) {
            case "headermagazine":
            case 'hero':
              element.html(beforeLoader()).parent().addClass("show-ify");
              break;
            case "layout2":
            case "layout3":
            case "layout4":
            case 'layout5':
            case "myvideo":
            case "sidebar1":
            case "opinion":
            case "sevencard":
            case "flatsome":
            case "col-left":
              $("#page-skin-2").prepend(url);
              element.html(beforeLoader()).parent().addClass("type-" + type + " column-widget id-" + parentId + '-' + type + " show-ify");
              break;
            case "list1":
              element.html(beforeLoader());
              break;
            case "related":
              element.html(beforeLoader()).parent().addClass("show-ify");
          }
        },
        'success': function (data) {
          var html = '';
          switch (type) {
            case "col-left":
              html = "<div class=\"column-items floaf-left\">";
              break;
            case 'hero':
              html = "<div class=\"block w-auto ui-hero-layouts float-none mb-4\"><div class=\"grid grid-cols-1 md:grid-cols-[30%_70%] md:gap-0 gap-x-4 md:gap-y-0 gap-y-3\">";
              break;
            case "layout2":
              html = "<div class=\"layout2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 float-none w-full\">";
              break;
            case 'layout3':
              html = "<div class=\"grid grid-cols-1 lg:grid-cols-2 gap-4 float-none w-full\">";
              break;
            case 'layout4':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 float-none w-full\">";
              break;
            case "layout5":
              html = "<div class=\"onthree float-none w-full\">";
              break;
            case 'myvideo':
              html = "<div class=\"my-video-blocks bg-[#323232] p-0 float-none w-full\">";
              break;
            case "sidebar1":
              html = "<div class=\"sidebar-one\">";
              break;
            case 'opinion':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-[40%_1fr] gap-0 float-none w-full opinion-blocks mb-6\">";
              break;
            case "sevencard":
              html = "<div class=\"flex flex-wrap w-full h-auto myseven-blocks-wow float-none sevencard-blocks mb-4\">";
              break;
            case "flatsome":
              html = "<div class=\"grid grid-cols-1 lg:grid-cols-[45%_30%_25%] bg-[#fff3e0] p-4 border-solid border-b border-[#ffc107] flatsome-area float-none w-full\">";
              break;
            case "headermagazine":
              html = "<div class=\"header-magazine-block flex items-center justify-center float-none w-full\">";
              break;
            case 'list1':
              html = "<div class=\"list1-items\">";
              break;
            case "related":
              html = "<div class=\"related-posts total-" + count + "\">";
          }
          var posts = data.feed.entry;
          if (null != posts) {
            for (var i = 0; i < posts.length; i++) {
              var link = getPostLink(data, i);
              var title = getPostTitle(data, i);
              var image = getPostImage(data, i, link);
              var [authorHtml, dateHtml] = getPostMeta(getPostAuthor(data, i), getPostDate(data, i));
              var tagHtml = getPostTag(data, i);
              var summaryHtml = getPostSummary(data, i, 78);
              var timeAgo = $.timeago(new Date($(summaryHtml).find('time.published').attr('datetime')));
              switch (type) {
                case "hero":
                  switch (i) {
                    case 0:
                      html += "<div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4 hero-tposts order-1 md:order-2 md:grid-cols-[60%_40%]\">";
                      html += "<article class=\"h-full min-h-72 item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG w-full h-56 md:h-72\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-full p-2 block mb-0 lazy-ify\" data-image=\"" + image + "\"></span>";
                      html += "</a>";
                      html += "<div class=\"entry-header bg-[#AA1D1D] p-4\">";
                      html += "<a class=\"text-[24px] text-white font-semibold leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<p class=\"!text-[14px] font-medium block mt-2 text-gray-100 entry-excerpt excerpt\">" + summaryHtml + "</p>";
                      html += "<span class=\"block mt-1 text-white\">" + dateHtml + "</span>";
                      html += "</div>";
                      html += '</article>';
                      break;
                    case 1:
                    case 2:
                      if (i === 1) {
                        html += "<div class=\"grid grid-cols-2 md:grid-cols-1 gap-4\">";
                      }
                      html += "<article class=\"md:flex-1 md:py-0 py-0 order-1 md:order-2 inline-block md:w-full md:w-auto md:max-w-auto md:min-w-full text-wrap max-w-[280px] pr-4 md:pr-0 py-2 md:py-0 md:block inline-block mb-2 md:border-solid  md:border-b border-gray-300 item-" + i + "\">";
                      html += "<a class=\"entry-image-link shimmerBG w-full h-24 md:h-32 block relative\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"w-block entry-thumb p-1 bg-center h-full w-full bg-no-repeat bg-cover\" data-image=\"" + image + "\"></span></a>";
                      html += "<a class=\"block md:text-xl text-[16px] leading-tight font-semibold mt-2 mb-1 text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-0.5 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</article>";
                      if (i === 2) {
                        html += '</div>';
                        html += '</div>';
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += " <div class=\"md:grid md:gap-1 block p-3 list-heros-items order-2 md:order-1 h-full md:overflow-x-hidden md:whitespace-normal overflow-x-scroll whitespace-nowrap md:mr-6 mr-0 md:w-auto w-full bg-gray-100\">";
                      }
                      html += "<article class=\"md:block md:w-auto md:!min-w-full inline-block md:max-w-auto text-wrap max-w-[280px] pr-4 md:pr-0 py-2 md:py-0 mb-1 item-" + i + "\">";
                      html += "<a class=\"block leading-tight text-[#000000de] font-semibold text-[19px] mb-2\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"mr-1 font-semibold text-red-800\">" + tagHtml + " ● </span>";
                      html += "<span class=\"text-gray-600\">" + timeAgo + "</span>";
                      html += '</article>';
                  }
                  break;
                case "layout2":
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"mg-box item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-44 md:h-36 p-2 block mb-2\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <div class=\"entry-header\">\n                        <a class=\"text-[20px] text-black font-semibold leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                            " + title + "\n                        </a>\n                        <span class=\"!text-[15px] font-medium block mt-2 text-gray-700\">\n                            " + summaryHtml + "\n                        </span>\n                        <span class=\"block mt-2 text-gray-700 text-[15px]\">\n                            " + dateHtml + "\n                        </span>\n                    </div>\n                </article>\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"mg-box item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb float-right md:float-none bg-center bg-no-repeat bg-cover md:w-full md:h-36 w-[120px] h-[95px] p-2 inline-block md:block mb-2 ml-2 md:ml-[0px]\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <div class=\"entry-header\">\n                        <a class=\"entry-title text-[20px] font-semibold leading-tight text-black\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                            " + title + "\n                        </a>\n                        <span class=\"!text-[15px] font-medium md:block mt-2 text-gray-700 hidden\">\n                            " + summaryHtml + "\n                        </span>\n                        <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n                            " + dateHtml + "\n                        </span>\n                    </div>\n                </article>\n            ";
                  }
                  break;
                case 'layout3':
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"frste entry-image-link shimmerBG w-full md:min-h-full h-[230px] block relative\">\n                    <span class=\"w-full h-full entry-thumb relative block bg-center bg-cover bg-no-repeat item-" + i + "\" data-image=\"" + image + "\">\n                        <span class=\"px-2 py-4 text-white absolute w-full bottom-0 left-0 right-0 block-gradient-bg\">\n                            <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"block font-semibold text-[24px] leading-normal text-white md:text-[32px]\">\n                                " + title + "\n                            </a>\n                            <span class=\"block text-[15px] text-white mt-2\">" + timeAgo + "</span>\n                        </span>\n                    </span>\n                </article>\n                <div class=\"flex items-stretch overflow-x-scroll md:overflow-x-auto md:whitespace-normal md:grid md:grid-cols-2 grid-cols-1 gap-2 hidemyscrollbar\">\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"p-0 my-2 md:my-auto block md:min-w-auto bypass-image item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\">\n                        <span class=\"entry-thumb bg-center bg-cover bg-no-repeat block w-full h-36\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <a class=\"entry-title block px-2 my-2 font-semibold text-[20px] text-black leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        " + title + "\n                    </a>\n                    <p class=\"text-gray-700 md:block mb-2 px-2 leading-tight hidden\">\n                        " + summaryHtml + "\n                    </p>\n                    <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n                        " + dateHtml + "\n                    </span>\n                </article>\n            ";
                  }
                  break;
                case "layout4":
                  switch (i) {
                    case 0:
                      html += "\n                <div class=\"sports-area\">\n                    <article class=\"sports-areas mb-2 pb-[15px] border-solid border-b border-gray-400 item-" + i + "\">\n                        <span class=\"entry-thumb relative block bg-center bg-cover bg-no-repeat w-auto h-[220px]\" data-image=\"" + image + "\">\n                            <div class=\"abs absolute bottom-0 left-0 right-0 text-white px-3 py-6\">\n                                <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"hover:text-[#ffb300] text-[20px] md:text-[30px] font-semibold leading-tight text-white block mb-1\">\n                                    " + title + "\n                                </a>\n                                <span class=\"text-sm mt-2 text-gray-200 block\">" + timeAgo + "</span>\n                            </div>\n                        </span>\n                    </article>\n            ";
                      break;
                    case 1:
                    case 2:
                      html += "\n                <article class=\"sports-areas item-" + i + "\">\n                    <span class=\"entry-thumb block bg-center bg-cover bg-no-repeat w-auto h-[130px]\" data-image=\"" + image + "\"></span>\n                    <div class=\"py-2\">\n                        <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"text-[18px] md:text-[22px] text-black font-semibold leading-tight block mb-1\">\n                            " + title + "\n                        </a>\n                        <p class=\"text-gray-700 md:block mb-2 px-2 leading-tight hidden\">\n                            " + summaryHtml + "\n                        </p>\n                        <span class=\"text-sm mt-2 text-gray-600 block\">" + dateHtml + "</span>\n                    </div>\n                </article>\n            ";
                      if (i === 2) {
                        html += '</div>';
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += "\n                    <div class=\"flex items-stretch pt-[20px] md:pt-0 border-t border-solid border-gray-400 md:border-none overflow-x-scroll md:overflow-x-auto md:whitespace-normal md:grid grid-cols-1 gap-2 hidemyscrollbar\">\n                ";
                      }
                      html += "\n                <article class=\"border-solid border-r border-gray-400 md:border-none after:float-none after:table after:clear-both md:w-auto md:!min-w-full !min-w-[250px] block pr-4 item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\">\n                        <span class=\"entry-thumb object-cover md:w-[130px] md:h-[130px] w-[100px] h-[100px] float-right ml-3 bg-center bg-cover bg-no-repeat\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <a class=\"entry-title text-[17px] md:text-[20px] leading-tight !text-justify\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        " + title + "\n                    </a>\n                    <span class=\"text-sm mt-2 text-gray-600 block\">" + dateHtml + "</span>\n                </article>\n            ";
                  }
                  break;
                case "layout5":
                  switch (i) {
                    case 0:
                      html += "\n        <article class=\"item-" + i + "\">\n          <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n            <span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-[280px] md:h-[320px] relative block\" data-image=\"" + image + "\">\n              <div class=\"abs absolute bottom-0 left-0 right-0 text-white px-3 py-6\">\n                <span class=\"hover:text-[#ffb300] text-[20px] md:text-[28px] font-semibold leading-tight text-white block mb-1\">\n                  " + title + "\n                </span>\n                <span class=\"text-sm mt-2 text-gray-200 block\">\n                  " + timeAgo + "\n                </span>\n              </div>\n            </span>\n          </a>\n        </article>";
                      break;
                    default:
                      html += "\n        <article class=\"item-" + i + "\">\n          <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n            <span class=\"entry-thumb block bg-center bg-cover bg-no-repeat w-auto md:h-[170px] h-[120px] lazy-ify\" data-image=\"" + image + "\">\n            </span>\n          </a>\n          <div class=\"entry-header py-2\">\n            <a class=\"entry-title text-[17px] md:text-[20px] font-semibold leading-tight text-black hover:text-[#ffb300]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n              " + title + "\n            </a>\n            <span class=\"!text-[15px] font-medium md:block mt-2 text-gray-700 hidden\">\n              " + summaryHtml + "\n            </span>\n            <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n              " + dateHtml + "\n            </span>\n          </div>\n        </article>";
                  }
                  break;
                case "myvideo":
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"new-video-items p-0 bg-[#121212] item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb relative bg-center bg-no-repeat bg-cover w-full h-64 md:h-80 block\" data-image=\"" + image + "\">\n                            <svg aria-hidden=\"true\" class=\"palo-icon w-8 h-8 inline-block text-xl fill-white absolute top-2 left-3\">\n                                <use xlink:href=\"#palo-video\"></use>\n                            </svg>\n                            <div class=\"text-white px-3 py-6\">\n                                <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"hover:text-[#ffb300] text-[30px] font-semibold leading-tight text-white block mb-1\">" + title + "</a>\n                                <span class=\"block text-[15px] text-white mt-2\">" + summaryHtml + "</span>\n                                <span class=\"text-sm mt-2 text-gray-200 block\">" + dateHtml + "</span>\n                            </div>\n                        </span>\n                    </a>\n                </article>\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"new-video-items p-0 bg-[#121212] item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"\" href=\"" + link + "\">\n                        <span class=\"entry-thumb relative block bg-center bg-cover bg-no-repeat w-auto md:h-40 h-28 lazy-ify\" data-image=\"" + image + "\">\n                            <svg aria-hidden=\"true\" class=\"palo-icon w-7 h-7 inline-block text-xl fill-white absolute top-2 left-3\">\n                                <use xlink:href=\"#palo-video\"></use>\n                            </svg>\n                        </span>\n                    </a>\n                    <div class=\"entry-header p-2\">\n                        <a class=\"entry-title font-semibold leading-tight !text-white\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" class=\"hover:!text-[#ffb300] text-[18px] !text-white\">\n                            " + title + "\n                        </a>\n                        <span class=\"block mt-1 md:mt-2 text-gray-400 text-[15px]\">" + dateHtml + "</span>\n                    </div>\n                </article>\n            ";
                  }
                  break;
                case "sidebar1":
                  html += "\n    <article class=\"block mb-4 after:float-none after:table after:clear-both item-" + i + "\">\n      <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n        <span class=\"entry-thumb float-right ml-[1em] after:float-none after:table after:clear-both h-[100px] w-[120px]\" data-image=\"" + image + "\"></span>\n      </a>\n      <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" class=\"block mb-2 text-[17px] font-semibold text-black\">\n        " + title + "\n      </a>\n      <p class=\"text-gray-800 md:block none hidden overflow-visible\">\n        " + summaryHtml + "\n      </p>\n      <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n        " + dateHtml + "\n      </span>\n    </article>";
                  break;
                case 'opinion':
                  switch (i) {
                    case 0:
                      html += "<article class=\"md:px-10 px-6 item-" + i + "\">";
                      html += "<div class=\"organism1 W6jTp relative\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"title-link bg-[#001246] shadow-md text-white leading-[2.222rem] box-decoration-clone text-[24px] md:text-[28px] ml-[-40px] font-bold hover:text-[#ffb300] px-2\" href=\"" + link + "\" title=\"" + link + "\"><span class=\"\"><span class=\"sub-title _4ckrT\">মতামত</span> " + title + "</span></a>";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" class=\"block my-4 text-[20px] px-2 text-[#595959]\" href=\"" + link + "\" title=\"\">" + summaryHtml + "</a>";
                      html += "<div class=\"flex items-center contributor-type-1 absolute bottom-4 wqvPE _8Veko\"><span class=\"contributor-name mr-1 text-lg text-black font-bold\">লেখা:</span><span class=\"author-location text-gray-600 text-[16px]\"> " + authorHtml + " </span></div>";
                      html += "</article>";
                      html += "<div class=\"block mt-6 md:mt-0\">";
                      break;
                    default:
                      html += "<article class=\"flex items-start motamot-smalls item-" + i + "\">";
                      html += "<div class=\"!@min-w-[40px] flex items-center justfy-center !@min-h-[40px] bg-gray-300 p-5 rounded-full\"><svg aria-hidden=\"true\" class=\"palo-icon w-8 h-8 inline-block fill-white\"><use xlink:href=\"#palo-pencil\"></use></svg></div>";
                      html += "<div class=\"ml-4\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"text-[#000000de] box-decoration-clone text-[17px] md:text-[21px] lg:text-[24px] hover:text-blue-700 block mb-4 leading-tight\" href=\"" + link + "\" title=\"" + link + "\"><span class=\"\"><span class=\"text-[#d60000] motamot-dots\">মতামত</span> " + title + "</span></a>";
                      html += "<span class=\"relative contributor-type-1 motamot-contributor-name author-location text-gray-600 text-[16px]\">" + authorHtml + " </span>";
                      html += "</article>";
                  }
                  break;
                case "sevencard":
                  switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                      if (i === 0) {
                        html += "<div class=\"herehidebd md:flex-1 hidemyscrollbar px-0 md:py-0 md:pr-4 pr-0 py-4 order-2 md:order-1 md:w-auto w-full md:overflow-x-hidden overflow-x-scroll whitespace-nowrap md:border-none border-y border-solid border-gray-300\">";
                      }
                      html += "<article class=\"mylast-sc md:w-auto md:min-w-full md:max-w-auto text-wrap max-w-[280px] pr-4 md:pr-0 py-4 md:py-0 md:block inline-block mb-2 md:border-solid  md:border-b border-gray-300 item-" + i + "\">";
                      html += "<span class=\"hidden md:block entry-thumb float-right bg-center bg-no-repeat bg-cover w-[120px] h-[95px] p-2 mb-2 ml-1\" data-image=\"" + image + "\"></span>";
                      html += "<div class=\"entry-header\">";
                      html += "<a class=\"entry-title text-[20px] font-semibold leading-tight text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</div>";
                      html += "</article>";
                      if (i === 3) {
                        html += '</div>';
                      }
                      break;
                    case 4:
                      html += "<article class=\"md:flex-1 md:py-0 py-4 order-1 md:order-2 inline-block w-full md:w-1/2 md:border-solid border-gray-400 border-x border-none md:px-4 item-" + i + "\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">";
                      html += "<div class=\"w-block entry-thumb p-1 w-full h-44 md:h-56 bg-center bg-no-repeat bg-cover\" data-image=\"" + image + "\"></div></a>";
                      html += "<a class=\"block text-xl font-semibold mt-2 mb-1 text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<p class=\"block text-base mt-1 mb-2 text-gray-800\">" + summaryHtml + '</p>';
                      html += "<span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                      html += "</article>";
                      break;
                    default:
                      if (i === 5) {
                        html += "<div class=\"herehidebd md:flex-1 pl-0 md:pl-4 md:py-0 py-4 order-3 md:order-3 inline-block md:w-auto w-full\"><div class=\"grid grid-cols-2 gap-4 md:block\">";
                      }
                      html += "<article class=\"mylast-sc md:w-auto md:min-w-full md:max-w-auto text-wrap max-w-[280px] md:block inline-block mb-2 md:border-solid border-none border-b  border-gray-300 item-" + i + "\">";
                      html += "<span class=\"block entry-thumb md:float-right float-none bg-center bg-no-repeat bg-cover md:w-[120px] md:h-[95px] w-full h-[95px] p-2 mb-2 md:ml-1 lazy-ify\" data-image=\"" + image + "\"></span>";
                      html += "<div class=\"entry-header\">";
                      html += "<a class=\"entry-title text-[16px] md:text-[20px] font-semibold leading-tight text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</div>";
                      break;
                  }
                  break;
                case 'flatsome':
                  switch (i) {
                    case 0:
                      html += "<div class=\"block\"><article class=\"mylast-sc item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG md:float-left float-none md:w-48 w-full md:h-44 h-40 mr-0 md:mr-4 mb-1\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"p-1 bg-center bg-cover bg-no-repeat block entry-thumb w-full h-full\" data-image=\"" + image + "\"></span>";
                      html += '<a>';
                      html += "<a class=\"font-semibold text-xl text-[#000000de] md:mt-0 mt-3 block\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + '</a>';
                      html += "<p class=\"text-gray-800 block my-1 text-base\">" + summaryHtml + "</p>";
                      html += "<span class=\"block text-gray-600 mt-0\">" + dateHtml + "</span>";
                      html += '</article></div>';
                      break;
                    case 1:
                    case 2:
                      if (i === 1) {
                        html += "<div class=\"block my-auto mx-auto md:mx-4 border-y md:border-y-0 pt-4 md:pt-0 md:border-solid border-[#0000001f] md:border-x md:px-4 px-0 \"><div class=\"md:block grid gap-x-6 grid-cols-2\">";
                      }
                      html += "<article class=\"mylast-sc mb-4 block border-none md:border-solid border-[#0000001f] border-b md:pr-4 pr-0 pb-3 item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG md:float-left md:w-20 md:h-20 w-full h-24 float-none mr-2 mb-1\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"entry-thumb w-full h-full bg-center bg-cover bg-no-repeat block p-1\" data-image=\"" + image + "\"></span>";
                      html += '<a>';
                      html += "<a class=\"font-semibold text-base md:text-lg lg:text-xl text-[#000000de] block mt-2\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + '</a>';
                      html += "<span class=\"block mt-1 md:mt-2 text-gray-400 text-[15px]\">" + dateHtml + "</span>";
                      html += '</article>';
                      if (i === 2) {
                        html += "</div></div>";
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += "<div class=\"block\"><article class=\"mylast-sc item-" + i + "\">";
                      }
                      html += "<img class=\"w-full h-auto p-0 object-cover block\" alt=\"Ads\" src=\"https://tpc.googlesyndication.com/simgad/958422863681223065\"/>";
                      html += '</article></div>';
                      break;
                  }
                  break;
                case 'col-left':
                  switch (i) {
                    case 0:
                      html += "<article class=\"column-item mytl-cls item-" + i + "\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link relative w-full h-[150px] float-none block overflow-hidden m-0\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"/></a><div class=\"entry-header\"><h2 class=\"entry-title text-[#000] block text-[20px] my-1 px-0 py-[14px] font-[700]\"><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a></h2></div></article>";
                      break;
                    default:
                      html += "<article class=\"column-item mytl-cls item-" + i + "\"><div class=\"entry-header\"><h2 class=\"entry-title text-[#393939] block text-[18px] my-1 px-0 py-[14px] font-[500]\"><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a></h2></div></article>";
                  }
                  break;
                case "headermagazine":
                  html += "<div class=\"header-magazine-card w-2/6 flex item-" + i + "\"><a class=\"entry-image-link block shimmerBG max-w-[70px] w-full h-16\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb lazy-ify w-full h-full bg-center bg-cover bg-no-repeat\" data-image=\"" + image + "\"></span></a><div class=\"px-2 pb-1\"><svg aria-hidden=\"true\" class=\"palo-icon w-5 h-5 mr-1 inline-block fill-red-600\"><use xlink:href=\"#palo-camera\"></use></svg><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" title=\"" + link + "\" alt=\"" + link + "\" class=\"turncate  text-[16px] text-[#000000de] font-medium\">" + title + "</a></div></div>";
                  break;
                case "list1":
                  switch (errorLabel) {
                    case "comments":
                      html = getPostComments(data, i, link);
                      break;
                    default:
                      html += "<article class=\"list1-item item-" + i + "\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\"><span class=\"entry-thumb\" data-image=\"" + image + "\"/></a><div class=\"entry-header\"><a class=\"entry-title !text-[17px]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>" + getPostMeta(getPostAuthor(data, i), getPostDate(data, i))[1] + "</div></article>";
                  }
                  break;
                case "related":
                  html += "<article class=\"related-item post item-" + i + "\"><div class=\"entry-image\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"/></a></div><div class=\"entry-header block mt-2\"><a class=\"entry-title !text-[1.15rem]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>" + getPostMeta(getPostAuthor(data, i), getPostDate(data, i))[1] + "</div></article>";
          }
          switch (type) {
            case 'msimple':
              html += "</ul>";
              element.append(html).addClass("msimple");
              element.find("a:first").attr("href", function (href, text) {
                switch (errorLabel) {
                  case "recent":
                    text = text.replace(text, "/search");
                    break;
                  default:
                    text = text.replace(text, "/search/label/" + errorLabel);
                }
                return text;
              });
              break;
            default:
              html += "</div>";
              element.html(html);
          }
          element.find('.entry-thumb').lazyify();
        },
        'error': function () {
          switch (type) {
            case "msimple":
            case "megatabs":
              element.append("<ul><span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span></ul>");
              break;
            default:
              element.html("<span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span>");
          }
        }
      });
  }
}

// Function to make AJAX call for mega menu
function ajaxMega(element, type, count, label, errorLabel) {
  if (errorLabel.match("getmega")) {
    if ("msimple" == type || 'megatabs' == type || "mtabs" == type) {
      return getAjax(element, type, count, label);
    }
    element.append("<ul class=\"mega-items\"><span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span></ul>");
  }
}

// Function to make AJAX call for block
function ajaxBlock(element, type, count, label, errorLabel, color) {
  if (errorLabel.match("getblock")) {
    if ("block1" == type || "block2" == type || 'headermagazine' == type || "col-left" == type || "col-right" == type || 'grid1' == type || "grid2" == type || "videos" == type || "hero" == type || "layout2" == type || 'layout3' == type || "layout4" == type || 'layout5' == type || "sidebar1" == type || "myvideo" == type || "opinion" == type || "sevencard" == type || "flatsome" == type) {
      var url;
      if (0 == count) {
        count = "geterror404";
      }
      var url = getFeedUrl(type, count, label);
      $.ajax({
        'url': url,
        'type': "GET",
        'dataType': "json",
        'cache': true,
        'beforeSend': function (xhr) {
          var parentId = element.parent().attr('id');
          switch (type) {
            case "headermagazine":
            case 'hero':
              element.html(beforeLoader()).parent().addClass("show-ify");
              break;
            case "layout2":
            case "layout3":
            case "layout4":
            case 'layout5':
            case "myvideo":
            case "sidebar1":
            case "opinion":
            case "sevencard":
            case "flatsome":
            case "col-left":
              $("#page-skin-2").prepend(url);
              element.html(beforeLoader()).parent().addClass("type-" + type + " column-widget id-" + parentId + '-' + type + " show-ify");
              break;
            case "list1":
              element.html(beforeLoader());
              break;
            case "related":
              element.html(beforeLoader()).parent().addClass("show-ify");
          }
        },
        'success': function (data) {
          var html = '';
          switch (type) {
            case "block1":
            case "block2":
              html = "<div class=\"block-items\">";
              break;
            case 'block3':
              html = "<div class=\"block-items-column\">";
              break;
            case 'headermagazine':
              html = "<div class=\"header-magazine-block flex items-center justify-center float-none w-full\">";
              break;
            case 'grid1':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case 'grid2':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case 'grid3':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case 'grid4':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case 'grid5':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case 'grid6':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-1 gap-0 float-none w-full\">";
              break;
            case "videos":
              html = "<div class=\"block-items video-items\">";
              break;
            case "hero":
              html = "<div class=\"block w-auto ui-hero-layouts float-none mb-4\"><div class=\"grid grid-cols-1 md:grid-cols-[30%_70%] md:gap-0 gap-x-4 md:gap-y-0 gap-y-3\">";
              break;
            case "layout2":
              html = "<div class=\"layout2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 float-none w-full\">";
              break;
            case 'layout3':
              html = "<div class=\"grid grid-cols-1 lg:grid-cols-2 gap-4 float-none w-full\">";
              break;
            case 'layout4':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 float-none w-full\">";
              break;
            case "layout5":
              html = "<div class=\"onthree float-none w-full\">";
              break;
            case 'myvideo':
              html = "<div class=\"my-video-blocks bg-[#323232] p-0 float-none w-full\">";
              break;
            case "sidebar1":
              html = "<div class=\"sidebar-one\">";
              break;
            case 'opinion':
              html = "<div class=\"grid grid-cols-1 md:grid-cols-[40%_1fr] gap-0 float-none w-full opinion-blocks mb-6\">";
              break;
            case "sevencard":
              html = "<div class=\"flex flex-wrap w-full h-auto myseven-blocks-wow float-none sevencard-blocks mb-4\">";
              break;
            case "flatsome":
              html = "<div class=\"grid grid-cols-1 lg:grid-cols-[45%_30%_25%] bg-[#fff3e0] p-4 border-solid border-b border-[#ffc107] flatsome-area float-none w-full\">";
              break;
            case "col-left":
              html = "<div class=\"column-items floaf-left\">";
              break;
          }
          var posts = data.feed.entry;
          if (null != posts) {
            for (var i = 0; i < posts.length; i++) {
              var link = getPostLink(data, i);
              var title = getPostTitle(data, i);
              var image = getPostImage(data, i, link);
              var [authorHtml, dateHtml] = getPostMeta(getPostAuthor(data, i), getPostDate(data, i));
              var tagHtml = getPostTag(data, i);
              var summaryHtml = getPostSummary(data, i, 78);
              var timeAgo = $.timeago(new Date($(summaryHtml).find('time.published').attr('datetime')));
              switch (type) {
                case "block1":
                case "block2":
                  html += "<article class=\"block-item item-" + i + "\">";
                  html += "<a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"></span></a>";
                  html += "<div class=\"entry-header\"><a class=\"entry-title text-[20px] font-semibold leading-tight text-black\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + summaryHtml + "</span>";
                  html += "</div>";
                  html += "</article>";
                  break;
                case 'block3':
                  html += "<article class=\"block-item item-" + i + "\">";
                  html += "<a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"></span></a>";
                  html += "<div class=\"entry-header\"><a class=\"entry-title text-[20px] font-semibold leading-tight text-black\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + summaryHtml + "</span>";
                  html += "</div>";
                  html += "</article>";
                  break;
                case 'headermagazine':
                  html += "<div class=\"header-magazine-card w-2/6 flex item-" + i + "\"><a class=\"entry-image-link block shimmerBG max-w-[70px] w-full h-16\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb lazy-ify w-full h-full bg-center bg-cover bg-no-repeat\" data-image=\"" + image + "\"></span></a><div class=\"px-2 pb-1\"><svg aria-hidden=\"true\" class=\"palo-icon w-5 h-5 mr-1 inline-block fill-red-600\"><use xlink:href=\"#palo-camera\"></use></svg><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" title=\"" + link + "\" alt=\"" + link + "\" class=\"turncate  text-[16px] text-[#000000de] font-medium\">" + title + "</a></div></div>";
                  break;
                case 'grid1':
                case 'grid2':
                case 'grid3':
                case 'grid4':
                case 'grid5':
                case 'grid6':
                  html += "<article class=\"block-item item-" + i + "\">";
                  html += "<a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"></span></a>";
                  html += "<div class=\"entry-header\"><a class=\"entry-title text-[20px] font-semibold leading-tight text-black\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + summaryHtml + "</span>";
                  html += "</div>";
                  html += "</article>";
                  break;
                case "videos":
                  html += "<article class=\"block-item item-" + i + "\">";
                  html += "<a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb relative block bg-center bg-cover bg-no-repeat w-full h-64 md:h-80\" data-image=\"" + image + "\"></span></a>";
                  html += "<div class=\"entry-header\"><a class=\"entry-title text-[20px] font-semibold leading-tight text-white\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                  html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + summaryHtml + "</span>";
                  html += "</div>";
                  html += "</article>";
                  break;
                case "hero":
                  switch (i) {
                    case 0:
                      html += "<div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4 hero-tposts order-1 md:order-2 md:grid-cols-[60%_40%]\">";
                      html += "<article class=\"h-full min-h-72 item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG w-full h-56 md:h-72\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-full p-2 block mb-0 lazy-ify\" data-image=\"" + image + "\"></span></a>";
                      html += "<div class=\"entry-header bg-[#AA1D1D] p-4\">";
                      html += "<a class=\"text-[24px] text-white font-semibold leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<p class=\"!text-[14px] font-medium block mt-2 text-gray-100 entry-excerpt excerpt\">" + summaryHtml + "</p>";
                      html += "<span class=\"block mt-1 text-white\">" + dateHtml + "</span>";
                      html += "</div>";
                      html += "</article>";
                      break;
                    case 1:
                    case 2:
                      if (i === 1) {
                        html += "<div class=\"grid grid-cols-2 md:grid-cols-1 gap-4\">";
                      }
                      html += "<article class=\"md:flex-1 md:py-0 py-0 order-1 md:order-2 inline-block md:w-full md:w-auto md:max-w-auto md:min-w-full text-wrap max-w-[280px] pr-4 md:pr-0 py-2 md:py-0 md:block inline-block mb-2 md:border-solid  md:border-b border-gray-300 item-" + i + "\">";
                      html += "<a class=\"entry-image-link shimmerBG w-full h-24 md:h-32 block relative\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"w-block entry-thumb p-1 bg-center h-full w-full bg-no-repeat bg-cover\" data-image=\"" + image + "\"></span></a>";
                      html += "<a class=\"block md:text-xl text-[16px] leading-tight font-semibold mt-2 mb-1 text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-0.5 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</article>";
                      if (i === 2) {
                        html += '</div>';
                        html += '</div>';
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += " <div class=\"md:grid md:gap-1 block p-3 list-heros-items order-2 md:order-1 h-full md:overflow-x-hidden md:whitespace-normal overflow-x-scroll whitespace-nowrap md:mr-6 mr-0 md:w-auto w-full bg-gray-100\">";
                      }
                      html += "<article class=\"md:block md:w-auto md:!min-w-full inline-block md:max-w-auto text-wrap max-w-[280px] pr-4 md:pr-0 py-2 md:py-0 mb-1 item-" + i + "\">";
                      html += "<a class=\"block leading-tight text-[#000000de] font-semibold text-[19px] mb-2\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"mr-1 font-semibold text-red-800\">" + tagHtml + " ● </span>";
                      html += "<span class=\"text-gray-600\">" + timeAgo + "</span>";
                      html += '</article>';
                  }
                  break;
                case "layout2":
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"mg-box item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-44 md:h-36 p-2 block mb-2\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <div class=\"entry-header\">\n                        <a class=\"text-[20px] text-black font-semibold leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                            " + title + "\n                        </a>\n                        <span class=\"!text-[15px] font-medium block mt-2 text-gray-700\">\n                            " + summaryHtml + "\n                        </span>\n                        <span class=\"block mt-2 text-gray-700 text-[15px]\">\n                            " + dateHtml + "\n                        </span>\n                    </div>\n                </article>\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"mg-box item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb float-right md:float-none bg-center bg-no-repeat bg-cover md:w-full md:h-36 w-[120px] h-[95px] p-2 inline-block md:block mb-2 ml-2 md:ml-[0px]\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <div class=\"entry-header\">\n                        <a class=\"entry-title text-[20px] font-semibold leading-tight text-black\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                            " + title + "\n                        </a>\n                        <span class=\"!text-[15px] font-medium md:block mt-2 text-gray-700 hidden\">\n                            " + summaryHtml + "\n                        </span>\n                        <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n                            " + dateHtml + "\n                        </span>\n                    </div>\n                </article>\n            ";
                  }
                  break;
                case 'layout3':
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"frste entry-image-link shimmerBG w-full md:min-h-full h-[230px] block relative\">\n                    <span class=\"w-full h-full entry-thumb relative block bg-center bg-cover bg-no-repeat item-" + i + "\" data-image=\"" + image + "\">\n                        <span class=\"px-2 py-4 text-white absolute w-full bottom-0 left-0 right-0 block-gradient-bg\">\n                            <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"block font-semibold text-[24px] leading-normal text-white md:text-[32px]\">\n                                " + title + "\n                            </a>\n                            <span class=\"block text-[15px] text-white mt-2\">" + timeAgo + "</span>\n                        </span>\n                    </span>\n                </article>\n                <div class=\"flex items-stretch overflow-x-scroll md:overflow-x-auto md:whitespace-normal md:grid md:grid-cols-2 grid-cols-1 gap-2 hidemyscrollbar\">\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"p-0 my-2 md:my-auto block md:min-w-auto bypass-image item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\">\n                        <span class=\"entry-thumb bg-center bg-cover bg-no-repeat block w-full h-36\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <a class=\"entry-title block px-2 my-2 font-semibold text-[20px] text-black leading-tight\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        " + title + "\n                    </a>\n                    <p class=\"text-gray-700 md:block mb-2 px-2 leading-tight hidden\">\n                        " + summaryHtml + "\n                    </p>\n                    <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n                        " + dateHtml + "\n                    </span>\n                </article>\n            ";
                  }
                  break;
                case "layout4":
                  switch (i) {
                    case 0:
                      html += "\n                <div class=\"sports-area\">\n                    <article class=\"sports-areas mb-2 pb-[15px] border-solid border-b border-gray-400 item-" + i + "\">\n                        <span class=\"entry-thumb relative block bg-center bg-cover bg-no-repeat w-auto h-[220px]\" data-image=\"" + image + "\">\n                            <div class=\"abs absolute bottom-0 left-0 right-0 text-white px-3 py-6\">\n                                <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"hover:text-[#ffb300] text-[20px] md:text-[30px] font-semibold leading-tight text-white block mb-1\">\n                                    " + title + "\n                                </a>\n                                <span class=\"text-sm mt-2 text-gray-200 block\">" + timeAgo + "</span>\n                            </div>\n                        </span>\n                    </article>\n            ";
                      break;
                    case 1:
                    case 2:
                      html += "\n                <article class=\"sports-areas item-" + i + "\">\n                    <span class=\"entry-thumb block bg-center bg-cover bg-no-repeat w-auto h-[130px]\" data-image=\"" + image + "\"></span>\n                    <div class=\"py-2\">\n                        <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"text-[18px] md:text-[22px] text-black font-semibold leading-tight block mb-1\">\n                            " + title + "\n                        </a>\n                        <p class=\"text-gray-700 md:block mb-2 px-2 leading-tight hidden\">\n                            " + summaryHtml + "\n                        </p>\n                        <span class=\"text-sm mt-2 text-gray-600 block\">" + dateHtml + "</span>\n                    </div>\n                </article>\n            ";
                      if (i === 2) {
                        html += '</div>';
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += "\n                    <div class=\"flex items-stretch pt-[20px] md:pt-0 border-t border-solid border-gray-400 md:border-none overflow-x-scroll md:overflow-x-auto md:whitespace-normal md:grid grid-cols-1 gap-2 hidemyscrollbar\">\n                ";
                      }
                      html += "\n                <article class=\"border-solid border-r border-gray-400 md:border-none after:float-none after:table after:clear-both md:w-auto md:!min-w-full !min-w-[250px] block pr-4 item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\">\n                        <span class=\"entry-thumb object-cover md:w-[130px] md:h-[130px] w-[100px] h-[100px] float-right ml-3 bg-center bg-cover bg-no-repeat\" data-image=\"" + image + "\"></span>\n                    </a>\n                    <a class=\"entry-title text-[17px] md:text-[20px] leading-tight !text-justify\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        " + title + "\n                    </a>\n                    <span class=\"text-sm mt-2 text-gray-600 block\">" + dateHtml + "</span>\n                </article>\n            ";
                  }
                  break;
                case "layout5":
                  switch (i) {
                    case 0:
                      html += "\n        <article class=\"item-" + i + "\">\n          <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n            <span class=\"entry-thumb bg-center bg-no-repeat bg-cover w-full h-[280px] md:h-[320px] relative block\" data-image=\"" + image + "\">\n              <div class=\"abs absolute bottom-0 left-0 right-0 text-white px-3 py-6\">\n                <span class=\"hover:text-[#ffb300] text-[20px] md:text-[28px] font-semibold leading-tight text-white block mb-1\">\n                  " + title + "\n                </span>\n                <span class=\"text-sm mt-2 text-gray-200 block\">\n                  " + timeAgo + "\n                </span>\n              </div>\n            </span>\n          </a>\n        </article>";
                      break;
                    default:
                      html += "\n        <article class=\"item-" + i + "\">\n          <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n            <span class=\"entry-thumb block bg-center bg-cover bg-no-repeat w-auto md:h-[170px] h-[120px] lazy-ify\" data-image=\"" + image + "\">\n            </span>\n          </a>\n          <div class=\"entry-header py-2\">\n            <a class=\"entry-title text-[17px] md:text-[20px] font-semibold leading-tight text-black hover:text-[#ffb300]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n              " + title + "\n            </a>\n            <span class=\"!text-[15px] font-medium md:block mt-2 text-gray-700 hidden\">\n              " + summaryHtml + "\n            </span>\n            <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n              " + dateHtml + "\n            </span>\n          </div>\n        </article>";
                  }
                  break;
                case "myvideo":
                  switch (i) {
                    case 0:
                      html += "\n                <article class=\"new-video-items p-0 bg-[#121212] item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n                        <span class=\"entry-thumb relative bg-center bg-no-repeat bg-cover w-full h-64 md:h-80 block\" data-image=\"" + image + "\">\n                            <svg aria-hidden=\"true\" class=\"palo-icon w-8 h-8 inline-block text-xl fill-white absolute top-2 left-3\">\n                                <use xlink:href=\"#palo-video\"></use>\n                            </svg>\n                            <div class=\"text-white px-3 py-6\">\n                                <a href=\"" + link + "\" title=\"" + title + "\" alt=\"" + title + "\" class=\"hover:text-[#ffb300] text-[30px] font-semibold leading-tight text-white block mb-1\">" + title + "</a>\n                                <span class=\"block text-[15px] text-white mt-2\">" + summaryHtml + "</span>\n                                <span class=\"text-sm mt-2 text-gray-200 block\">" + dateHtml + "</span>\n                            </div>\n                        </span>\n                    </a>\n                </article>\n            ";
                      break;
                    default:
                      html += "\n                <article class=\"new-video-items p-0 bg-[#121212] item-" + i + "\">\n                    <a title=\"" + title + "\" alt=\"" + title + "\" class=\"\" href=\"" + link + "\">\n                        <span class=\"entry-thumb relative block bg-center bg-cover bg-no-repeat w-auto md:h-40 h-28 lazy-ify\" data-image=\"" + image + "\">\n                            <svg aria-hidden=\"true\" class=\"palo-icon w-7 h-7 inline-block text-xl fill-white absolute top-2 left-3\">\n                                <use xlink:href=\"#palo-video\"></use>\n                            </svg>\n                        </span>\n                    </a>\n                    <div class=\"entry-header p-2\">\n                        <a class=\"entry-title font-semibold leading-tight !text-white\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" class=\"hover:!text-[#ffb300] text-[18px] !text-white\">\n                            " + title + "\n                        </a>\n                        <span class=\"block mt-1 md:mt-2 text-gray-400 text-[15px]\">" + dateHtml + "</span>\n                    </div>\n                </article>\n            ";
                  }
                  break;
                case "sidebar1":
                  html += "\n    <article class=\"block mb-4 after:float-none after:table after:clear-both item-" + i + "\">\n      <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">\n        <span class=\"entry-thumb float-right ml-[1em] after:float-none after:table after:clear-both h-[100px] w-[120px]\" data-image=\"" + image + "\"></span>\n      </a>\n      <a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" class=\"block mb-2 text-[17px] font-semibold text-black\">\n        " + title + "\n      </a>\n      <p class=\"text-gray-800 md:block none hidden overflow-visible\">\n        " + summaryHtml + "\n      </p>\n      <span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">\n        " + dateHtml + "\n      </span>\n    </article>";
                  break;
                case 'opinion':
                  switch (i) {
                    case 0:
                      html += "<article class=\"md:px-10 px-6 item-" + i + "\">";
                      html += "<div class=\"organism1 W6jTp relative\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"title-link bg-[#001246] shadow-md text-white leading-[2.222rem] box-decoration-clone text-[24px] md:text-[28px] ml-[-40px] font-bold hover:text-[#ffb300] px-2\" href=\"" + link + "\" title=\"" + link + "\"><span class=\"\"><span class=\"sub-title _4ckrT\">মতামত</span> " + title + "</span></a>";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" class=\"block my-4 text-[20px] px-2 text-[#595959]\" href=\"" + link + "\" title=\"\">" + summaryHtml + "</a>";
                      html += "<div class=\"flex items-center contributor-type-1 absolute bottom-4 wqvPE _8Veko\"><span class=\"contributor-name mr-1 text-lg text-black font-bold\">লেখা:</span><span class=\"author-location text-gray-600 text-[16px]\"> " + authorHtml + " </span></div>";
                      html += "</article>";
                      html += "<div class=\"block mt-6 md:mt-0\">";
                      break;
                    default:
                      html += "<article class=\"flex items-start motamot-smalls item-" + i + "\">";
                      html += "<div class=\"!@min-w-[40px] flex items-center justfy-center !@min-h-[40px] bg-gray-300 p-5 rounded-full\"><svg aria-hidden=\"true\" class=\"palo-icon w-8 h-8 inline-block fill-white\"><use xlink:href=\"#palo-pencil\"></use></svg></div>";
                      html += "<div class=\"ml-4\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"text-[#000000de] box-decoration-clone text-[17px] md:text-[21px] lg:text-[24px] hover:text-blue-700 block mb-4 leading-tight\" href=\"" + link + "\" title=\"" + link + "\"><span class=\"\"><span class=\"text-[#d60000] motamot-dots\">মতামত</span> " + title + "</span></a>";
                      html += "<span class=\"relative contributor-type-1 motamot-contributor-name author-location text-gray-600 text-[16px]\">" + authorHtml + " </span>";
                      html += "</article>";
                  }
                  break;
                case "sevencard":
                  switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                      if (i === 0) {
                        html += "<div class=\"herehidebd md:flex-1 hidemyscrollbar px-0 md:py-0 md:pr-4 pr-0 py-4 order-2 md:order-1 md:w-auto w-full md:overflow-x-hidden overflow-x-scroll whitespace-nowrap md:border-none border-y border-solid border-gray-300\">";
                      }
                      html += "<article class=\"mylast-sc md:w-auto md:min-w-full md:max-w-auto text-wrap max-w-[280px] pr-4 md:pr-0 py-4 md:py-0 md:block inline-block mb-2 md:border-solid  md:border-b border-gray-300 item-" + i + "\">";
                      html += "<span class=\"hidden md:block entry-thumb float-right bg-center bg-no-repeat bg-cover w-[120px] h-[95px] p-2 mb-2 ml-1\" data-image=\"" + image + "\"></span>";
                      html += "<div class=\"entry-header\">";
                      html += "<a class=\"entry-title text-[20px] font-semibold leading-tight text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</div>";
                      html += "</article>";
                      if (i === 3) {
                        html += '</div>';
                      }
                      break;
                    case 4:
                      html += "<article class=\"md:flex-1 md:py-0 py-4 order-1 md:order-2 inline-block w-full md:w-1/2 md:border-solid border-gray-400 border-x border-none md:px-4 item-" + i + "\">";
                      html += "<a title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">";
                      html += "<div class=\"w-block entry-thumb p-1 w-full h-44 md:h-56 bg-center bg-no-repeat bg-cover\" data-image=\"" + image + "\"></div></a>";
                      html += "<a class=\"block text-xl font-semibold mt-2 mb-1 text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<p class=\"block text-base mt-1 mb-2 text-gray-800\">" + summaryHtml + '</p>';
                      html += "<span class=\"block mt-1 md:mt-2 text-gray-700 text-[15px]\">" + dateHtml + "</span>";
                      html += "</article>";
                      break;
                    default:
                      if (i === 5) {
                        html += "<div class=\"herehidebd md:flex-1 pl-0 md:pl-4 md:py-0 py-4 order-3 md:order-3 inline-block md:w-auto w-full\"><div class=\"grid grid-cols-2 gap-4 md:block\">";
                      }
                      html += "<article class=\"mylast-sc md:w-auto md:min-w-full md:max-w-auto text-wrap max-w-[280px] md:block inline-block mb-2 md:border-solid border-none border-b  border-gray-300 item-" + i + "\">";
                      html += "<span class=\"block entry-thumb md:float-right float-none bg-center bg-no-repeat bg-cover md:w-[120px] md:h-[95px] w-full h-[95px] p-2 mb-2 md:ml-1 lazy-ify\" data-image=\"" + image + "\"></span>";
                      html += "<div class=\"entry-header\">";
                      html += "<a class=\"entry-title text-[16px] md:text-[20px] font-semibold leading-tight text-[#000000de]\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + "</a>";
                      html += "<span class=\"block mt-2 text-gray-700 text-[15px]\">" + dateHtml + '</span>';
                      html += "</div>";
                      break;
                  }
                  break;
                case 'flatsome':
                  switch (i) {
                    case 0:
                      html += "<div class=\"block\"><article class=\"mylast-sc item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG md:float-left float-none md:w-48 w-full md:h-44 h-40 mr-0 md:mr-4 mb-1\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"p-1 bg-center bg-cover bg-no-repeat block entry-thumb w-full h-full\" data-image=\"" + image + "\"></span>";
                      html += '<a>';
                      html += "<a class=\"font-semibold text-xl text-[#000000de] md:mt-0 mt-3 block\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + '</a>';
                      html += "<p class=\"text-gray-800 block my-1 text-base\">" + summaryHtml + "</p>";
                      html += "<span class=\"block text-gray-600 mt-0\">" + dateHtml + "</span>";
                      html += '</article></div>';
                      break;
                    case 1:
                    case 2:
                      if (i === 1) {
                        html += "<div class=\"block my-auto mx-auto md:mx-4 border-y md:border-y-0 pt-4 md:pt-0 md:border-solid border-[#0000001f] md:border-x md:px-4 px-0 \"><div class=\"md:block grid gap-x-6 grid-cols-2\">";
                      }
                      html += "<article class=\"mylast-sc mb-4 block border-none md:border-solid border-[#0000001f] border-b md:pr-4 pr-0 pb-3 item-" + i + "\">";
                      html += "<a class=\"entry-image-link block shimmerBG md:float-left md:w-20 md:h-20 w-full h-24 float-none mr-2 mb-1\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\">";
                      html += "<span class=\"entry-thumb w-full h-full bg-center bg-cover bg-no-repeat block p-1\" data-image=\"" + image + "\"></span>";
                      html += '<a>';
                      html += "<a class=\"font-semibold text-base md:text-lg lg:text-xl text-[#000000de] block mt-2\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" class=\"\" href=\"" + link + "\" title=\"" + link + "\">" + title + '</a>';
                      html += "<span class=\"block mt-1 md:mt-2 text-gray-400 text-[15px]\">" + dateHtml + "</span>";
                      html += '</article>';
                      if (i === 2) {
                        html += "</div></div>";
                      }
                      break;
                    default:
                      if (i === 3) {
                        html += "<div class=\"block\"><article class=\"mylast-sc item-" + i + "\">";
                      }
                      html += "<img class=\"w-full h-auto p-0 object-cover block\" alt=\"Ads\" src=\"https://tpc.googlesyndication.com/simgad/958422863681223065\"/>";
                      html += '</article></div>';
                      break;
                  }
                  break;
                case 'col-left':
                  switch (i) {
                    case 0:
                      html += "<article class=\"column-item mytl-cls item-" + i + "\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link relative w-full h-[150px] float-none block overflow-hidden m-0\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"/></a><div class=\"entry-header\"><h2 class=\"entry-title text-[#000] block text-[20px] my-1 px-0 py-[14px] font-[700]\"><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a></h2></div></article>";
                      break;
                    default:
                      html += "<article class=\"column-item mytl-cls item-" + i + "\"><div class=\"entry-header\"><h2 class=\"entry-title text-[#393939] block text-[18px] my-1 px-0 py-[14px] font-[500]\"><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a></h2></div></article>";
                  }
                  break;
                case "headermagazine":
                  html += "<div class=\"header-magazine-card w-2/6 flex item-" + i + "\"><a class=\"entry-image-link block shimmerBG max-w-[70px] w-full h-16\" title=\"" + title + "\" alt=\"" + title + "\" target=\"_self\" aria-label=\"" + title + "\" href=\"" + link + "\"><span class=\"entry-thumb lazy-ify w-full h-full bg-center bg-cover bg-no-repeat\" data-image=\"" + image + "\"></span></a><div class=\"px-2 pb-1\"><svg aria-hidden=\"true\" class=\"palo-icon w-5 h-5 mr-1 inline-block fill-red-600\"><use xlink:href=\"#palo-camera\"></use></svg><a title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\" title=\"" + link + "\" alt=\"" + link + "\" class=\"turncate  text-[16px] text-[#000000de] font-medium\">" + title + "</a></div></div>";
                  break;
                case "list1":
                  switch (errorLabel) {
                    case "comments":
                      html = getPostComments(data, i, link);
                      break;
                    default:
                      html += "<article class=\"list1-item item-" + i + "\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\"><span class=\"entry-thumb\" data-image=\"" + image + "\"/></a><div class=\"entry-header\"><a class=\"entry-title !text-[17px]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>" + getPostMeta(getPostAuthor(data, i), getPostDate(data, i))[1] + "</div></article>";
                  }
                  break;
                case "related":
                  html += "<article class=\"related-item post item-" + i + "\"><div class=\"entry-image\"><a title=\"" + title + "\" alt=\"" + title + "\" class=\"entry-image-link\" href=\"" + link + "\"><span class=\"entry-thumb w-full h-full\" data-image=\"" + image + "\"></span></a></div><div class=\"entry-header block mt-2\"><a class=\"entry-title !text-[1.15rem]\" title=\"" + title + "\" alt=\"" + title + "\" href=\"" + link + "\">" + title + "</a>" + getPostMeta(getPostAuthor(data, i), getPostDate(data, i))[1] + "</div></article>";
          }
          switch (type) {
            case 'msimple':
              html += "</ul>";
              element.append(html).addClass("msimple");
              element.find("a:first").attr("href", function (href, text) {
                switch (errorLabel) {
                  case "recent":
                    text = text.replace(text, "/search");
                    break;
                  default:
                    text = text.replace(text, "/search/label/" + errorLabel);
                }
                return text;
              });
              break;
            default:
              html += "</div>";
              element.html(html);
          }
          element.find('.entry-thumb').lazyify();
        },
        'error': function () {
          switch (type) {
            case "msimple":
            case "megatabs":
              element.append("<ul><span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span></ul>");
              break;
            default:
              element.html("<span class=\"error-msg\"><b>দুঃখিতঃ</b> একটি ত্রুটি দেখা দিয়েছে</span>");
          }
        }
      });
  }
}

// Function to make AJAX call for related content
function ajaxRelated(element, type, count, label, errorLabel) {
  if (errorLabel.match("getrelated")) {
    return getAjax(element, type, count, label);
  }
}

// Function to parse shortcode
function paloShortcode(shortcode, key) {
  var parts = shortcode.split('$');
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].trim() == key) {
      return parts[i + 1].match(/[^{\}]+(?=})/g) && String(parts[i + 1].match(/[^{\}]+(?=})/g)).trim();
    }
  }
  return false;
}

// Function to beautify avatar
function beautiAvatar(avatar) {
  $(avatar).attr("src", function (src, url) {
    return url = url.replace("//resources.blogblog.com/img/blank.gif", "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSLyItXbcG1IzmEGw7xnAC0WVpW9p5nj3FZXPtdF2QiI5_POzeYNJW6dygK-qtQvn7W8t7CUd0TJDf-r-2ceSWOFSvB7uO7aqsqOWm79COnS_XzwGb2DOC3FiaR0eRy9_kn8IRDrMQna0/s35-r/avatar.jpg").replace("//img1.blogblog.com/img/blank.gif", "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSLyItXbcG1IzmEGw7xnAC0WVpW9p5nj3FZXPtdF2QiI5_POzeYNJW6dygK-qtQvn7W8t7CUd0TJDf-r-2ceSWOFSvB7uO7aqsqOWm79COnS_XzwGb2DOC3FiaR0eRy9_kn8IRDrMQna0/s35-r/avatar.jpg");
  });
}

// Initialize menu
$("#palo-clone-pro-main-menu").menuify();
$("#palo-clone-pro-main-menu-nav > li > a").each(function () {
  var link = $(this);
  var href = link.attr("href").toLowerCase().trim();
  if ('home-icon' == href) {
    link.addClass("homepage home-icon").attr("href", '/').text('');
  } else if ("home-text" == href) {
    link.addClass('homepage').attr("href", '/');
  }
});

// Show/hide menu
$(".search-toggle-deactive").on("click", function () {
  $("body").toggleClass("search-active");
});

// Set theme
$('html').each(function () {
  var html = $(this);
  if (1 != darkMode) {
    html.attr("data-theme", localStorage.dataTheme);
    $(".darkmode-toggle,.mobile-darkmode-toggle").on("click", function () {
      if ("dark" != localStorage.dataTheme) {
        html.attr("data-theme", "dark");
        localStorage.dataTheme = "dark";
      } else {
        html.attr('data-theme', 'light');
        localStorage.dataTheme = 'light';
      }
    });
  }
});

// Set view all text
$(".blog-posts-title a.more,.related-title a.more").each(function () {
  var more = $(this);
  if ('' != viewAllText) {
    more.text(viewAllText);
  }
});

// Set follow by email text
$('.follow-by-email-text').each(function () {
  var text = $(this);
  if ('' != followByEmailText) {
    text.text(followByEmailText);
  }
});

// Initialize sidebar tabs
$("#sidebar-tabs").each(function () {
  var tabs = $(this);
  var count = tabs.find('.widget').length;
  tabs.addClass("style-" + count);
  tabs.tabify();
});

// Initialize post body
$(".post-body strike").each(function () {
  var strike = $(this);
  var text = strike.text().trim();
  if ("$ads={1}" == text) {
    strike.replaceWith("<div id=\"palo-clone-pro-new-before-ad\"/>");
  }
  if ("$ads={2}" == text) {
    strike.replaceWith("<div id=\"palo-clone-pro-new-after-ad\"/>");
  }
});
$("#palo-clone-pro-new-before-ad").each(function () {
  var beforeAd = $(this);
  if (beforeAd.length) {
    $("#before-ad").appendTo(beforeAd);
  }
});
$("#palo-clone-pro-new-after-ad").each(function () {
  var afterAd = $(this);
  if (afterAd.length) {
    $('#after-ad').appendTo(afterAd);
  }
});
$("#palo-clone-pro-main-before-ad .widget").each(function () {
  var widget = $(this);
  if (widget.length) {
    widget.appendTo($("#before-ad"));
  }
});
$("#palo-clone-pro-main-after-ad .widget").each(function () {
  var widget = $(this);
  if (widget.length) {
    widget.appendTo($("#after-ad"));
  }
});
$(".post-body strike").each(function () {
  var strike = $(this);
  var text = strike.text().trim();
  strike.html();
  if (text.match("left-sidebar")) {
    strike.replaceWith("<style>.is-single #main-wrapper{float:right}.is-single #sidebar-wrapper{float:left}</style>");
  }
  if (text.match('right-sidebar')) {
    strike.replaceWith("<style>.is-single #main-wrapper{float:left}.is-single #sidebar-wrapper{float:right}</style>");
  }
  if (text.match("full-width")) {
    strike.replaceWith("<style>.is-single #main-wrapper{width:100%}.is-single #sidebar-wrapper{display:none}</style>");
  }
});

// Initialize share links
$(".palo-clone-pro-share-links .window-ify").on('click', function () {
  var link = $(this);
  var url = link.data('url');
  var width = link.data("width");
  var height = link.data("height");
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var x = Math.round(screenWidth / 2 - width / 2);
  var y = Math.round(screenHeight / 2 - height / 2);
  window.open(url, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + width + ',height=' + height + ",left=" + x + ",top=" + y).focus();
});

// Initialize share links
$('.palo-clone-pro-share-links').each(function () {
  var links = $(this);
  links.find(".show-hid a").on("click", function () {
    links.toggleClass("show-hidden");
  });
});

// Initialize author description links
$(".about-author .author-description span a").each(function () {
  var link = $(this);
  var text = link.text().trim();
  var href = link.attr('href');
  link.replaceWith("<li class=\"" + text + "\"><a href=\"" + href + "\" title=\"" + text + "\" target=\"_blank\"/></li>");
  $(".description-links").append($(".author-description span li"));
  $(".description-links").addClass('show');
});

// Initialize menu items
$("#palo-clone-pro-main-menu li").each(function (i, link) {
  var link = $(this);
  var href = link.find('a').attr("href").trim();
  var text = paloShortcode(href, "type");
  var label = paloShortcode(href, "label");
  if (href.toLowerCase().match("getmega")) {
    link.addClass("has-sub mega-menu");
  }
  ajaxMega(link, text, 5, label, href.toLowerCase().match("getmega"));
  if ("mtabs" == text) {
    if (0 != label) {
      label = label.split('/');
    }
    megatabs(link, text, label, href.toLowerCase().match("getmega"));
  }
});

// Initialize content blocks
$(".palo-clone-pro-content-blocks .HTML .widget-content").each(function (i, content) {
  var content = $(this);
  var text = content.text().trim();
  var type = paloShortcode(text, "type");
  var results = paloShortcode(text, "results");
  var label = paloShortcode(text, "label");
  var color = paloShortcode(text, 'color');
  ajaxBlock(content, type, results, label, text.toLowerCase().match("getblock"));
});

// Initialize widget-ready blocks
$(".palo-clone-pro-widget-ready .HTML .widget-content").each(function (i, content) {
  var content = $(this);
  var text = content.text().trim();
  var type = paloShortcode(text, 'type');
  var results = paloShortcode(text, "results");
  var label = paloShortcode(text, 'label');
  sidelist(content, type, results, label);
});

// Initialize related content
$(".palo-clone-pro-related-content").each(function () {
  var content = $(this);
  var label = content.find(".related-tag").attr('data-label');
  ajaxRelated(content, "related", relatedPostsNum, label);
});

// Initialize blog post comments
$(".palo-clone-pro-blog-post-comments").each(function () {
  var comments = $(this);
  var system = "comments-system-" + commentsSystem;
  switch (commentsSystem) {
    case 'blogger':
      comments.addClass(system).show();
      $(".entry-meta .entry-comments-link").addClass("show");
      beautiAvatar(".avatar-image-container img");
      break;
    case "hide":
      comments.hide();
      break;
    default:
      comments.addClass("comments-system-blogger").show();
      $(".entry-meta .entry-comments-link").addClass("show");
      beautiAvatar(".avatar-image-container img");
  }
  var reply = comments.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply");
  var continueThread = comments.find(".comments .toplevel-thread > #top-continue");
  reply.on("click", function () {
    continueThread.show();
  });
  continueThread.on('click', function () {
    continueThread.hide();
  });
});

// Initialize mobile menu
$(function () {
  $(".index-post .entry-image-link .entry-thumb, .entry-thumb, .PopularPosts .entry-image-link .entry-thumb, .FeaturedPost .entry-image-link .entry-thumb,.about-author .author-avatar").lazyify();
  $('#palo-clone-pro-mobile-menu').each(function () {
    var mobileMenu = $(this);
    var menu = $("#palo-clone-pro-main-menu-nav").clone();
    menu.attr('id', "main-mobile-nav");
    menu.find(".mega-items, .mega-tab").remove();
    menu.find("a.home-icon").each(function () {
      var link = $(this);
      var text = link.attr("data-text").trim();
      link.text(text);
    });
    menu.find("li.mega-tabs .complex-tabs").each(function () {
      var tabs = $(this);
      tabs.replaceWith(tabs.find("> ul.select-tab").attr("class", "sub-menu m-sub"));
    });
    menu.find(".mega-menu:not(.mega-tabs) > a").each(function (i, link) {
      var link = $(this);
      var href = link.attr("href").trim();
      if (href.toLowerCase().match("getmega")) {
        link.attr("href", href.toLowerCase().replace(href.toLowerCase(), "/search"));
      }
    });
    menu.find(".mega-tabs ul li > a").each(function () {
      var link = $(this);
      var text = link.text().trim();
      link.attr("href", "/search/label/" + text);
    });
    menu.appendTo(mobileMenu);
    $(".mobile-menu-toggle, .hide-palo-clone-pro-mobile-menu, .overlay").on("click", function () {
      $("body").toggleClass('nav-active');
    });
    $(".palo-clone-pro-mobile-menu .has-sub").append("<div class=\"submenu-toggle\"/>");
    $(".palo-clone-pro-mobile-menu .mega-menu").find('.submenu-toggle').remove();
    $(".palo-clone-pro-mobile-menu .mega-tabs").append("<div class=\"submenu-toggle\"/>");
    $(".palo-clone-pro-mobile-menu ul li .submenu-toggle").on("click", function (e) {
      if ($(this).parent().hasClass("has-sub")) {
        e.preventDefault();
        if ($(this).parent().hasClass("show")) {
          $(this).parent().removeClass('show').find("> .m-sub").slideToggle(0xaa);
        } else {
          $(this).parent().addClass('show').children(".m-sub").slideToggle(0xaa);
        }
      }
    });
  });
  $(".mobile-navbar-menu").each(function () {
    var menu = $(this);
    $("#main-navbar-menu ul.menu").clone().appendTo(menu);
  });
  $(".mobile-navbar-social").each(function () {
    var social = $(this);
    $("#main-navbar-social ul.social").clone().appendTo(social);
  });
  $(".main-menu-wrap .main-menu").each(function () {
    var menu = $(this);
    if (1 == fixedMenu && menu.length > 0) {
      var scrollTop = $(document).scrollTop();
      var offsetTop = menu.offset().top;
      var height = menu.height();
      var bottom = offsetTop + height + 32;
      $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if (scrollTop < $("#footer-wrapper").offset().top - height) {
          if (scrollTop > bottom) {
            menu.addClass("is-fixed");
          } else if (scrollTop < offsetTop) {
            menu.removeClass("is-fixed");
          }
          if (scrollTop > offsetTop) {
            menu.removeClass("show");
          } else {
            menu.addClass("show");
          }
          scrollTop = $(document).scrollTop();
        }
      });
    }
  });
  $("#main-logo").each(function () {
    var logo = $(this);
    if (1 == fixedMenu && logo.length > 0) {
      var scrollTop = $(document).scrollTop();
      var offsetTop = logo.offset().top;
      var height = logo.height();
      var bottom = offsetTop + height;
      $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if (scrollTop < $('#footer-wrapper').offset().top - height) {
          if (scrollTop > bottom) {
            logo.addClass("is-fixed");
          } else if (scrollTop <= 0) {
            logo.removeClass("is-fixed");
          }
          if (scrollTop > offsetTop) {
            logo.removeClass("show");
          } else {
            logo.addClass("show");
          }
          scrollTop = $(document).scrollTop();
        }
      });
    }
  });
  $("#main-wrapper,#sidebar-wrapper").each(function () {
    if (1 == fixedSidebar) {
      var sticky = {
        "additionalMarginTop": 10,
        additionalMarginBottom: 10
      };
      $(this).theiaStickySidebar(sticky);
    }
  });
  $('p.comment-content').each(function () {
    var content = $(this);
    content.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, "<img src=\"$1\"/>");
    content.replaceText(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g, "<div class=\"responsive-video-wrap\"><iframe id=\"youtube\" width=\"100%\" height=\"358\" src=\"https://www.youtube.com/embed/$1\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>");
  });
  $("#palo-clone-pro-load-more-link").each(function () {
    var link = $(this).data('load');
    if (link) {
      $("#palo-clone-pro-load-more-link").show();
    }
    $("#palo-clone-pro-load-more-link").on("click", function (e) {
      $('#palo-clone-pro-load-more-link').hide();
      $.ajax({
        'url': link,
        'success': function (data) {
          var posts = $(data).find(".blog-posts");
          posts.find('.index-post').addClass("post-animated post-fadeInUp");
          $(".blog-posts").append(posts.html());
          if (link = $(data).find("#palo-clone-pro-load-more-link").data("load")) {
            $('#palo-clone-pro-load-more-link').show();
          } else {
            $("#palo-clone-pro-load-more-link").hide();
            $("#blog-pager .no-more").addClass('show');
          }
          $(".index-post .entry-image-link .entry-thumb").lazyify();
          $("time.timeago").timeago();
          $('.entry-thumb').lazyify();
          $("#main-wrapper").each(function () {
            if (1 == fixedSidebar) {
              $(this).theiaStickySidebar();
            }
          });
        },
        'beforeSend': function () {
          $("#blog-pager .loading").show();
        },
        'complete': function () {
          $("#blog-pager .loading").hide();
        }
      });
      e.preventDefault();
    });
  });
});

// Initialize post body
$(".post-body blockquote").each(function () {
  var blockquote = $(this);
  var text = blockquote.text().toLowerCase().trim();
  var html = blockquote.html();
  if (text.match('{alertsuccess}')) {
    var success = html.replace("{alertSuccess}", '');
    blockquote.replaceWith("<div class=\"alert-message alert-success\">" + success + "</div>");
  }
  if (text.match('{alertinfo}')) {
    var info = html.replace("{alertInfo}", '');
    blockquote.replaceWith("<div class=\"alert-message alert-info\">" + info + "</div>");
  }
  if (text.match("{alertwarning}")) {
    var warning = html.replace("{alertWarning}", '');
    blockquote.replaceWith("<div class=\"alert-message alert-warning\">" + warning + "</div>");
  }
  if (text.match("{alerterror}")) {
    var error = html.replace("{alertError}", '');
    blockquote.replaceWith("<div class=\"alert-message alert-error\">" + error + "</div>");
  }
  if (text.match('{codebox}')) {
    var code = html.replace('{codeBox}', '');
    blockquote.replaceWith("<pre class=\"code-box\">" + code + "</pre>");
  }
});

// Initialize iframe
$("#post-body iframe").each(function () {
  var iframe = $(this);
  if (iframe.attr("src").match("www.youtube.com")) {
    iframe.wrap("<div class=\"responsive-video-wrap\"/>");
  }
});

// Decode URL
const decodedURL = atob("9jZG4uanNkZWxpdnIubmV0L2doL2l0c21kaWJyYWhpbS9wcm90aG9tYWxvL2xpY2VuY29zdS5qc29u").replace(/./g, (_ => _ % 2 === 0 ? String.fromCharCode(_.charCodeAt(0) ^ 2) : _));

// Initialize timeago
$(document).ready(function () {
  $("time.timeago").timeago();
  $(".entry-thumb").lazyify();
});

// Initialize timeago
$(document).ready(function () {
  $(".comment-reply").each(function () {
    $(this).text('জবাব');
  });
  $(".item-control.blog-admin a").each(function () {
    $(this).text("ডিলিট");
  });
  $(".custom-lazy-image").lazyify();
});
//Comments
