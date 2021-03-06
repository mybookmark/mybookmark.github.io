	var sourceMap = [];
	var allItemList=[];
	var newsCounter =0;
	var titleVal ="新聞書簽";
	
	$(document).ready(function(){
		$(this).scrollTop(0);
		$('#includeNavBar').load('/navbar.html', function(responseTxt, statusTxt, xhr){
		      initValue();
		});
		
	});

	function toggleReadMore(element){
		console.log("toggle read more");
			$(element).hide();
			$(element).next().show();
	}
	
	function initValue(){
		// set title in every page
		$("#mybookmarkTitle").text(titleVal);
		$("navbar_main").text(titleVal);
		$(".appTitle-template").text(titleVal);
		
		// set navbar status for every page
		var currentPage = window.location.href;
		console.log("add class" + currentPage);
		if (currentPage.includes("index") || ! currentPage.includes(".html"))
		{
			$("#navbar_main").addClass("navbar-selected-template");			 
		}else if (currentPage.includes("china"))
		{
			$("#navbar_china").addClass("navbar-selected-template");
		}else if (currentPage.includes("world"))
		{
			$("#navbar_world").addClass("navbar-selected-template");
		}else if (currentPage.includes("sea"))
		{
			$("#navbar_sea").addClass("navbar-selected-template");
		}else if (currentPage.includes("finance"))
		{
			$("#navbar_finance").addClass("navbar-selected-template");			
		}else if (currentPage.includes("entertainment"))
		{
			$("#navbar_entertainment").addClass("navbar-selected-template");
		}
				
	}
	
	function loadNews(sourceInfo, columnID){
		
		var fullListContent = "";
		//console.log("counter = " + newsCounter);
		//console.log("allItemList = " + allItemList.length);

		if (newsCounter == (sourceInfo.length -1))
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
				
				//console.log("----original--------------------------------");
				//console.log(varDescription);
				if (varDescription.indexOf("</div") !== -1)
				{
				   varDescription = varDescription.substring(0, varDescription.indexOf("</div>")) +"</div>";
				}
				varDescription = varDescription.replace(/<strong>/g,'');
				varDescription = varDescription.replace(/<\/strong>/g,'');
				
				varDescription = varDescription.replace(/<b>/g,'');
				varDescription = varDescription.replace(/<\/b>/g,'');
				varDescription = varDescription.replace(/<b/g,'');				
				varDescription = varDescription.replace(/<\/b/g,'');
				
				varDescription = varDescription.replace(/<p\.\.\./g,'');				
				varDescription = varDescription.replace(/<\/\.\.\./g,'');
				
				varDescription = varDescription.replace(/<\/p\.\.\./g,'</p>');
				varDescription = varDescription.replace(/<\.\.\./g,'</p>');
				
				console.log("--------------------------------------");
				console.log(varDescription);
				
				var rowType ="odd";
				if (j%2 == 0)
					rowType="even";
				
				var itemContent = "<div class='newsContainer-template-" +rowType+"'><a href='" + varLink
				+ "' class='newsContainerLink-template' target='_blank'>";
				itemContent = itemContent + "<div class='newsTitle-template'>";
				itemContent = itemContent + varTitle + "</div>";
				itemContent = itemContent + "<div class='newsMeta-template'>"
						+ author + " - "
						+ varPubDate+ "</div></a>";				
				itemContent = itemContent + "<div class='readMore' onclick='toggleReadMore(this)'>更多 ...</div>";
				itemContent = itemContent + "<div class='newsDescription-template'>"
						+ varDescription + "</div>";
				itemContent = itemContent + "</div>";
				
				fullListContent = fullListContent + itemContent;
			}
			columnID.html(fullListContent);
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

		if (link.includes("ft"))
			return sourceMap["ft"];

		if (link.includes("malaysiakini"))
			return sourceMap["malaysiakini"];

		if (link.includes("wsj"))
			return sourceMap["wsj"];
	}
	function loadRSS(sourceInfo, columnID)
	{
		console.log("sourceInfo size =" + sourceInfo.length);
		if (sourceInfo != null && sourceInfo.length > 0)
		{	
			console.log("loadRSS()------------------------");
			for (i = 0; i < sourceInfo.length; i++)
			{ 
				console.log("loading "+ sourceInfo[i].link + ".............");
				
				var url = sourceInfo[i].link;
				  
				var yqlURL = [
						"https://query.yahooapis.com/v1/public/yql",
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
									   
						loadNews(sourceInfo, columnID);
				 });		
				console.log("loadRSS() successfully from " + sourceInfo[i].id);
			}// end of sourceInfo for loop			
			console.log("complete loadRSS()------------------------");
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

