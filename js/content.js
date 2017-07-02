var worldContentCounter = 9;
var json_sourceInfo;
var sourceMap ={};
var allItemList=[];
var newsCounter =0;
function getMore() {
	worldContentCounter = worldContentCounter + 9;
}


window.onload = function() {
	loadSource();
	
	var var_worldNewsColumn = document.getElementById("worldNewsColumn");
	 
	//loadDataAsynchronously(iframe, src);
}
function loadNews(){
	
	var fullListContent = "";//$("#worldNewsColumn").html();
	console.log("counter = " + newsCounter);
	console.log("allItemList = " + allItemList.length);
	var itemFixContent = "<div class='newsContainer-template'><div class='newsTitle-template'>";

	if (newsCounter == (json_sourceInfo.length -1))
    {
		console.log("reach here");
		allItemList.sort(compare);
    	for (j =0; j <allItemList.length; j++)
    	{    		
        	var varTitle =$(allItemList[j]).find('title').text();
        	var varLink = $(allItemList[j]).find('link').text();
        	var varDescription = $(allItemList[j]).find('description').text();
        	var varPubDate = $(allItemList[j]).find('pubDate').text();
        	 
        	var author =getAuthor(varLink);
        	
        	var itemContent = "<a href='" + varLink
			+ "' class='newsContainerLink-template' target='_blank'>";
			itemContent = itemContent + itemFixContent;
			itemContent = itemContent + varTitle + "</div>";
			itemContent = itemContent + "<div class='newsMeta-template'>"
					+ author + " - "
					+ varPubDate+ "</div>";
			itemContent = itemContent + "<div class='newsDescription-template'>"
					+ varDescription + "</div></div></div></a>";

			fullListContent = fullListContent + itemContent;
    	}
    	$("#worldNewsColumn").html(fullListContent);
    }
	 newsCounter++;
}

function getAuthor(link)
{
	var author = "";
	if (link.includes("bbc"))
		return sourceMap["bbc"];
	
	if (link.includes("nytimes"))
		return sourceMap["nytimes"];
	
	if (link.includes("reuters"))
		return sourceMap["reuters"];
	
	if (link.includes("sina"))
		return sourceMap["sina"];
	
	if (link.includes("qq"))
		return sourceMap["qq"];
	
	if (link.includes("mingpao"))
		return sourceMap["mingpao"];
	
	if (link.includes("zaobao"))
		return sourceMap["zaobao"];
}
function loadRSS()
{
	console.log("sourceInfo size =" + json_sourceInfo.length);
	if (json_sourceInfo != null && json_sourceInfo.length > 0)
	{	
		console.log("loadRSS()------------------------");
		for (i = 0; i < json_sourceInfo.length; i++)
		{ 
			console.log("loading "+ json_sourceInfo[i].link + ".............");
			
			var url = json_sourceInfo[i].link;
			  
			var yqlURL = [
			        "http://query.yahooapis.com/v1/public/yql",
			        "?q=" + encodeURIComponent("select * from xml where url='" + url + "'"),
			        "&format=xml&callback=?"
			    ].join("");
			
			 $.getJSON(yqlURL, function(data){
				 	var parseData = $.parseXML(data.results[0]);
			        var items = $(parseData).find("item");

			        if (allItemList.length > 0)
			        	allItemList = $.merge(allItemList, items);
			        else
			        	allItemList = items;		
			        			   
			        loadNews();
			 });		
			console.log("loadRSS() successfully from " + json_sourceInfo[i].id);
		}		
	}
}
function compare(a,b) 
{
	var varPubDate_A = $(a).find('pubDate').text();
	var varPubDate_B = $(b).find('pubDate').text();
	if( (new Date(varPubDate_A).getTime() > new Date(varPubDate_B).getTime()))
	{
		return -1;
	}
	if( (new Date(varPubDate_A).getTime() < new Date(varPubDate_B).getTime()))
	{
		return 1;
	}
  
	return 0;
}

	
function loadSource()
{
	 $.ajax({
	        type: "GET",
	        contentType: "application/json",
	        url: "/sourceInfo",
	        //data: ,
	        dataType: 'json',
	        cache: false,
	        timeout: 600000,
	        success: function (data) {

	            json_sourceInfo = data;
	            
	            console.log("SUCCESS : ", data);	          
	            for (x = 0; x < json_sourceInfo.length; x++)
	            {	
	            	sourceMap[json_sourceInfo[x].id]= json_sourceInfo[x].name;
	            }
	            loadRSS();
	        },
	        error: function (e) {

	            var json = "<h4>Ajax Response</h4><pre>"
	                + e.responseText + "</pre>";
	            $('#feedback').html(json);

	            console.log("ERROR : ", e);
	            $("#btn-search").prop("disabled", false);

	        }
	    });
}
