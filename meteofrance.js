/*
 * This script parses Meteofrance's snow bulletins (text and standard versions) and renders associated images
 */

var system = require("system"),
    webPage = require("webpage"),
    fs = require("fs");

var config = {
  base_url: "http://www.meteofrance.com/previsions-meteo-montagne/bulletin-avalanches/",
  json_file: "meteofrance.json",
  user_agent: "MFBot/1.0 (phantomjs/camptocamp.org)",
  options: {
    debug: false
  },
  departments: [{
    id: "74",
    url: "haute-savoie/avdept74",
    name: "Haute-Savoie",
    mountain_ranges: [{
      name: "Chablais",
      url: "chablais/OPP01",
      id: "OPP01"
    }, {
      name: "Aravis",
      url: "aravis/OPP02",
      id: "OPP02"
    }, {
      name: "Mont-Blanc",
      url: "mont-blanc/OPP03",
      id: "OPP03"
    }]
  }, {
    id: "73",
    url: "savoie/avdept73",
    name: "Savoie",
    mountain_ranges: [{
      name: "Bauges",
      url: "bauges/OPP04",
      id: "OPP04"
    }, {
      name: "Beaufortin",
      url: "beaufortin/OPP05",
      id: "OPP05"
    }, {
      name: "Haute-Tarentaise",
      url: "haute-tarentaise/OPP06",
      id: "OPP06"
    }, {
      name: "Maurienne",
      url: "maurienne/OPP09",
      id: "OPP09"
    }, {
      name: "Vanoise",
      url: "vanoise/OPP10",
      id: "OPP10"
    }, {
      name: "Haute-Maurienne",
      url: "haute-maurienne/OPP11",
      id: "OPP11"
    }]
  }, {
    id: "38",
    url: "isere/avdept38",
    name: "Isère",
    mountain_ranges: [{
      name: "Chartreuse",
      url: "chartreuse/OPP07",
      id: "OPP07"
    }, {
      name: "Belledonne",
      url: "belledonne/OPP08",
      id: "OPP08"
    }, {
      name: "Grandes-Rousses",
      url: "grandes-rousses/OPP12",
      id: "OPP12"
    }, {
      name: "Vercors",
      url: "vercors/OPP14",
      id: "OPP14"
    }, {
      name: "Oisans",
      url: "oisans/OPP15",
      id: "OPP15"
    }]
  }, {
    id: "04",
    url: "alpes-de-haute-provence/avdept04",
    name: "Alpes-de-Haute-Provence",
    mountain_ranges: [{
      name: "Ubaye",
      url: "ubaye/OPP21",
      id: "OPP21"
    }, {
      name: "Haut-Var/Haut-Verdon",
      url: "haut-var-haut-verdon/OPP22",
      id: "OPP22"
    }]
  }, {
    id: "06",
    url: "alpes-maritimes/avdept06",
    name: "Alpes-Maritime",
    mountain_ranges: [{
      name: "Haut-Var/Haut-Verdon",
      url: "haut-var-haut-verdon/OPP22",
      id: "OPP22"
    }, {
      name: "Mercantour",
      url: "mercantour/OPP23",
      id: "OPP23"
    }]
  }, {
    id: "05",
    url: "hautes-alpes/avdept05",
    name: "Hautes-Alpes",
    mountain_ranges: [{
      name: "Thabor",
      url: "thabor/OPP13",
      id: "OPP13"
    }, {
      name: "Pelvoux",
      url: "pelvoux/OPP16",
      id: "OPP16"
    }, {
      name: "Queyras",
      url: "queyras/OPP17",
      id: "OPP17"
    }, {
      name: "Dévoluy",
      url: "devoluy/OPP18",
      id: "OPP18"
    }, {
      name: "Champsaur",
      url: "champsaur/OPP19",
      id: "OPP19"
    }, {
      name: "Embrunnais-Parpaillon",
      url: "embrunnais-parpaillon/OPP20",
      id: "OPP20"
    }]
  }, {
    id: "2a",
    url: "corse-du-sud/avdept2a",
    name: "Corse-du-Sud",
    mountain_ranges: [{
      name: "Cinto-Rotondo",
      url: "cinto-rotondo/OPP40",
      id: "OPP40"
    }, {
      name: "Renoso",
      url: "renoso/OPP41",
      id: "OPP41"
    }]
  }, {
    id: "2b",
    url: "haute-corse/avdept2b",
    name: "Haute-Corse",
    mountain_ranges: [{
      name: "Cinto-Rotondo",
      url: "cinto-rotondo/OPP40",
      id: "OPP40"
    }, {
      name: "Renoso",
      url: "renoso/OPP41",
      id: "OPP41"
    }]
  }, {
    id: "andorre",
    url: "andorre/avandorre",
    name: "Andorre",
    mountain_ranges: [{
      name: "Andorre",
      url: "andorre/OPP71",
      id: "OPP71"
    }]
  }, {
    id: "09",
    url: "ariege/avdept09",
    name: "Ariège",
    mountain_ranges: [{
      name: "Couserans",
      url: "couserans/OPP69",
      id: "OPP69"
    }, {
      name: "Haute-Ariège",
      url: "haute-ariege/OPP70",
      id: "OPP70"
    }, {
      name: "Orlu-St-Barthelemy",
      url: "orlu-st-barthelemy/OPP72",
      id: "OPP72"
    }]
  }, {
    id: "31",
    url: "haute-garonne/avdept31",
    name: "Haute-Garonne",
    mountain_ranges: [{
      name: "Luchonnais",
      url: "luchonnais/OPP68",
      id: "OPP68"
    }, {
      name: "Couserans",
      url: "couserans/OPP69",
      id: "OPP69"
    }]
  }, {
    id: "65",
    url: "hautes-pyrenees/avdept65",
    name: "Hautes-Pyrénées",
    mountain_ranges: [{
      name: "Haute-Bigorre",
      url: "haute-bigorre/OPP66",
      id: "OPP66"
    }, {
      name: "Aure-Louron",
      url: "aure-louron/OPP67",
      id: "OPP67"
    }]
  }, {
    id: "64",
    url: "pyrenees-atlantiques/avdept64",
    name: "Pyrénées-Atlantiques",
    mountain_ranges: [{
      name: "Pays-Basque",
      url: "pays-basque/OPP64",
      id: "OPP64"
    }, {
      name: "Aspe-Ossau",
      url: "aspe-ossau/OPP65",
      id: "OPP65"
    }]
  }, {
    id: "66",
    url : "pyrenees-orientales.avdept66",
    name: "Pyrénées-Orientales",
    mountain_ranges: [{
      name: "Capcir-Puymorens",
      url: "capcir-puymorens/OPP73",
      id: "OPP73"
    }, {
      name: "Cerdagne-Canigou",
      url: "cerdagne-canigou/OPP74",
      id: "OPP74"
    }]
  }]
};

function usage() {
  console.log("Usage: " + args[0] + " [option] ... department_code");
  console.log("Available options: ");
  console.log("    --help / -h         : display this message");
  console.log("    --debug / -d        : display debug information");
  console.log("    --working-dir=<dir> : change working directory");
}

function info(msg) {
  if (config.options.debug) {
    console.log("> " + msg);
  }
}

// arguments parsing
var args = system.args;

if (args.length === 1) {
  usage();
  phantom.exit(1);
}

for (var i=1; i<args.length; i++) {
  var matches = /([a-zA-Z-]+)(=(.*))?/.exec(args[i]);

  if (matches) {
    var option = matches[1],
        value = matches[3];
  }

  switch (option) {
    case "--help":
    case "-h":
      usage();
      phantom.exit();
    case "--debug":
    case "-d":
      config.options.debug = true;
      break;
    case "--working-dir":
      if (!fs.exists(value)) {
        console.log("invalid working directory: " + value);
        phantom.exit(1);
      }
      info("changing working directory to " + value);
      fs.changeWorkingDirectory(value);
      break;
    default:
      if (i !== args.length - 1) {
        console.log("Unknown option: " + args[i]);
        phantom.exit(1);
      }
      break;
  }
}

var dpt_code = args[args.length - 1];
var dpt = null;
for (i=0; i<config.departments.length; i++) {
  if (config.departments[i].id === dpt_code) {
    dpt = config.departments[i];
    break;
  }
}
if (!dpt) {
  console.log("Invalid department code");
  usage();
  phantom.exit(1);
}

function handle_dpt_page(dpt, urlClbk, finalClbk) {
  var page, output;

  // retrieve dpt page and check if we have text bulletin (simple text for the departmenr)
  // or full bulletin (one page for each range of the department)
  page = webPage.create();
  page.settings.userAgent = config.user_agent;

  return page.open(config.base_url + dpt.url, function(status) {
    if (status == "success") {
      return window.setTimeout(function() {
        info("Parsing " + (config.base_url + dpt.url));

        output = page.evaluate(function() {
          return $("#p_p_id_bulletinsNeigeAvalanche_WAR_mf3rpcportlet_ .mod-body:eq(1)").html();
        });

        if (output !== null) {
          // text bulletin
          info("Assuming simple text bulletin");
          return finalClbk(output);

        } else {
          // full bulletin
          info("Assuming full bulletin");
          page.close();
          handle_range_pages(dpt.mountain_ranges, urlClbk, finalClbk);
        }
      }, 2000);
    } else {
      console.log("An error occured when retrieving department page");
      phantom.exit(1);
    }
  });
}

function handle_range_pages(range_urls, urlClbk, finalClbk) {
  var page, next, retrieve_range, output = "", toc = "";

  next = function(status, url) {
    page.close();
    urlClbk(status, url);
    return retrieve_range();
  };

  retrieve_range = function() {
    if (range_urls.length > 0) {
      var range = range_urls.shift();
      page = webPage.create();
      page.settings.userAgent = config.user_agent;
      page.onConsoleMessage = function(msg) {
        info(msg);
      }
      var last = range_urls.length === 0;

      return page.open(config.base_url + range.url, function(status) {
        if (status === "success") {
          return window.setTimeout(function() {
            var url = config.base_url + range.url;
            info("Parsing " + url);

            function mountain_range_title() {
              return page.evaluate(function() {
                var text = $.trim($("#BRA .BRAentete").find("h1")[1].innerHTML);
                console.log("mountain range title: " + text);
                return text;
              });
            }

            function risk_estimation() {
              return page.evaluate(function() {
                var text = $.trim($("#BRA").find("p")[0].innerHTML);
                console.log("risk estimation: " + text);
                return text;
              });
            }

            function risk_cartouche_content() {
              return page.evaluate(function() {
                var text = $.trim($("#BRA .cartouche").find("p")[0].outerHTML);
                console.log("estimation cartouche: " + text);
                return text;
              });
            }

            function snow_stability_title() {
              return page.evaluate(function() {
                var text = $("#BRA h2:eq(1)").text();
                console.log(text);
                return text;
              });
            }

            function snow_stability_content() {
              return page.evaluate(function() {
                var text = $("#BRA pre")[0].outerHTML;
                console.log("estimation cartouche: " + text);
                return text;
              });
            }

            function recent_snow_title() {
              return page.evaluate(function() {
                var text = $("#BRA .row .col1 h2:eq(0)").text();
                console.log(text);
                return text;
              });
            }

            function snow_quality_title() {
              return page.evaluate(function() {
                var text = $("#BRA .row .col2 h2:eq(1)").text();
                console.log(text);
                return text;
              });
            }

            function snow_quality_content() {
              return page.evaluate(function() {
                var text = $("#BRA .row .col2 pre")[0].outerHTML;
                console.log("snow quality: " + text);
                return text;
              });
            }

            function snow_height_title() {
              return page.evaluate(function() {
                var text = $("#BRA .row .col1 h2:eq(1)").text();
                console.log(text);
                return text;
              });
            }

            function next_risk_title() {
              return page.evaluate(function() {
                var text = $("#BRA h2:eq(1)").text();
                console.log(text);
                return text;
              });
            }

            function wheather_forecast_title() {
              return page.evaluate(function() {
                var text = $("#BRA .row .col2 h2:eq(0)").text();
                console.log(text);
                return text;
              });
            }

            function recent_wheather_title() {
              return page.evaluate(function() {
                var text = $("#BRA h2:eq(2)").text();
                console.log(text);
                return text;
              });
            }

            function acknowledge() {
              return page.evaluate(function() {
                var text = $("p.basdepage").text();
                console.log(text);
                return text;
              });
            }

            function next_risk_content() {
              return page.evaluate(function() {
                var options = $("ul.BRAtendance li");
                var content = "<ul>";
                for (var i = 0; i < options.length; i++) {
                  content += "<li>" + options.eq(i).text();
                  switch(options.eq(i).find("img").attr("alt")) {
                    case "baisse":
                      content += " &#x2198;"; break;
                    case "stable":
                      content += " &#x2192;"; break;
                    case "hausse":
                      content += " &#x2197;"; break;
                    default:
                      content += " ?"; break;
                  }
                  content += "</li>";
                }
                content += "</ul>";

                return content;
              });
            }

            function risk_cartouche_image(range) {
              var bcr = page.evaluate(function() {
                return $("#BRA .figurineRisque")[0].getBoundingClientRect();
              });

              page.clipRect = {
                top: bcr.top,
                left: bcr.left + 125,
                width: bcr.width,
                height: bcr.height
              };

              page.render("mf_" + range.id + "_risk_cartouche.png");

              info("Rendered image mf_" + range.id + "_risk_cartouche.png");

              return "<div><img width='200' height='80' src='mf_" + range.id + "_risk_cartouche.png' /></div>"
            }

            function recent_snow_image(range) {
              var bcr = page.evaluate(function() {
                return $("#BRA .row .col1 img")[0].getBoundingClientRect();
              });

              page.clipRect = {
                top: bcr.top,
                left: bcr.left + 125,
                width: bcr.width,
                height: bcr.height
              };

              page.render("mf_" + range.id + "_recent_snow.png");

              info("Rendered image mf_" + range.id + "_recent_snow.png");

              return "<div><img width='" + bcr.width + "' height='" + bcr.height +
                     "' src='mf_" + range.id + "_recent_snow.png' /></div>";
            }

            function snow_height_image(range) {
              var bcr = page.evaluate(function() {
                return $("#BRA .row .col1 img")[1].getBoundingClientRect();
              });

              page.clipRect = {
                top: bcr.top,
                left: bcr.left + 125,
                width: bcr.width,
                height: bcr.height
              };

              page.render("mf_" + range.id + "_snow.png");

              info("Rendered image mf_" + range.id + "_snow.png");

              return "<div><img width='" + (bcr.width - 2) + "' height='" + (bcr.height - 3) +
                     "' src='mf_" + range.id + "_snow.png' /></div>";
            }

            function wheather_forecast_image() {
              var bcr = page.evaluate(function() {
                return $("table.tableauMeteo")[0].getBoundingClientRect();
              });

              page.clipRect = {
                top: bcr.top,
                left: bcr.left + 125,
                width: bcr.width,
                height: bcr.height
              };

              page.render("mf_" + range.id + "_forecast.png");

              info("Rendered image mf_" + range.id + "_forecast.png");

              return "<div><img width='" + bcr.width + "' height='" + bcr.height +
                     "' src='mf_" + range.id + "_forecast.png' /></div>";
            }

            function recent_wheather_image() {
              var bcr = page.evaluate(function() {
                return $("#BSH_graph")[0].getBoundingClientRect();
              });

              page.clipRect = {
                top: bcr.top,
                left: bcr.left + 125,
                width: bcr.width,
                height: bcr.height
              };

              page.render("mf_" + range.id + "_wheather.png");

              info("Rendered image mf_" + range.id + "_wheather.png");

              return "<div><img width='" + bcr.width + "' height='" + bcr.height +
                     "' src='mf_" + range.id + "_wheather.png' /></div>";
            }

            try {
              toc += "<a href='#" + range.id + "'>" + range.name + "</a>&nbsp;&nbsp;&nbsp;";

              // risk evaluation
              output += // title
                        "<hr />" +
                        "<h3><a name='" + url.split("/").pop() + "' href='" + url + "'>" + mountain_range_title() + "</a>" +
                        "&nbsp;<a href='#toc'><small>Sommaire</small></a></h3>" +
                        // risk
                        "<h3>" + risk_estimation() + "</h3>" +
                        risk_cartouche_content() +
                        risk_cartouche_image(range) +
                        // snow stability
                        "<h3>" + snow_stability_title() + "</h3>" +
                        snow_stability_content() +
                        // recent snow
                        "<h3>" + recent_snow_title() + "</h3>" +
                        recent_snow_image(range) +
                        // wheather_forecast
                        "<h3>" + wheather_forecast_title() + "</h3>" +
                        wheather_forecast_image(range) +
                        // snow quality
                        "<h3>" +snow_quality_title() + "</h3>" +
                        snow_quality_content() +
                        // snow height
                        "<h3>" + snow_height_title() + "</h3>" +
                        snow_height_image(range) +
                        // next risk
                        "<h3>" + next_risk_title() + "</h3>" +
                        next_risk_content() +
                        // recent wheather
                        "<h3>" + recent_wheather_title() + "</h3>" +
                        recent_wheather_image(range);

              if (last) {
                output += "<hr /><i>" + acknowledge() + "</i>";
              }

              return next(status, range.url);
            } catch (e) {
              console.log("An error occured when handling a range page");
              console.log(e);
              phantom.exit(1);
            }
          }, 2000); // we need some time for the recent snow graph to appear
        } else {
          console.log("An error occured when retrieving a range page");
          phantom.exit(1);
        }
      });
    } else {
      return finalClbk("<a name='toc'></a><p>" + toc + "</p>" + output);
    }
  };

  return retrieve_range();
}

handle_dpt_page(dpt, function(status, url) {
  if (status === "success") {
    return info("Correctly retrieved " + url);
  } else {
    return info("Failed when retrieving " + url);
  }
}, function(output) {
  var json = fs.exists(config.json_file) && fs.isFile(config.json_file) && JSON.parse(fs.read(config.json_file)) || {};

  json[dpt.id] = {
    content: output,
    updated: new Date().getTime()
  };
  try {
    fs.write(config.json_file, JSON.stringify(json));
  } catch (e) {
    console.log("Cannot write to file");
    phantom.exit(1);
  }

  info("Finished script correctly");
  info("Output is:");
  info(output);
  phantom.exit();
});
