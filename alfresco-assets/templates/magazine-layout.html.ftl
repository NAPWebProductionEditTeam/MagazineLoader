<#assign pageNumber 		= args['pageNumber']?number>
<#assign issueNumber 		= args['issueNumber']>
<#assign totalPages			= args['totalPages']?number>
<#assign archivePage 		= totalPages+1>
<#assign carouselWidth 		= (totalPages+1) * 950> 
<#assign showArchive 		= args['showArchive']?number>
<#assign showContents 		= args['showContents']?number>
<#assign language			= args['language']?lower_case>
<#assign channel			= args['channel']?lower_case>
<#assign shareLink			= "http://www.net-a-porter.com/${channel}/magazine/${issueNumber}/${pageNumber}" >
<#assign shareBody 			= message('magazine.share.body')+" "+shareLink>
<#assign shareSubject 		= message('magazine.share.subject')?url('UTF-8')>
<#assign offset				= 0>
<#assign issueDate			= args['issueDate']?date("yyyy-MM-dd") />

<#setting locale = args['language']+"_"+args["country"] />

<#assign contents 			= message("magazine.contents")>
<#assign archive 			= message("magazine.archive")>
<#assign magazine 			= message("magazine.magazine")>
<#assign previousPage 		= message("magazine.previous")>
<#assign nextPage 			= message("magazine.next")>

<#if (pageNumber > totalPages)>
	<#assign showContents 	= 1>
	<#assign pageNumber 	= 0>
<#elseif showArchive == 1>
	<#assign offset 		= -(totalPages * 950)>
	<#assign pageNumber 	= totalPages+1>
<#elseif ((pageNumber == 0) && (showArchive == 0))>
	<#assign showContents 	= 1>
<#else>
	<#assign offset 		= -((pageNumber-1) * 950)>
</#if>

<#-- Product overlays using require -->
<#--	
<link rel="stylesheet" type="text/css" href="/alfresco/nap/webAssets/shared/frontend/styles/style.css">
    <script type="text/javascript">
        var require = {
            baseUrl: '/alfresco/nap/webAssets/shared/frontend/',
            deps: ['config', 'product-overlay/app/main']
        };
    </script>

    <script type="text/javascript" src="/alfresco/nap/webAssets/shared/frontend/common/libs/require.js"></script> 
-->

<#macro printArchiveEntry flattenedObject >
<#compress>
    <#assign archiveProps = flattenedObject?split(",") >
    <#assign archivedIssueNumber = "" /><#assign archivedIssueDate = "" /><#assign archivedIssueTitle = "" /><#assign archivedIssueDescription = "" /><#assign archivedIssueCoverPath = "" />

    <#list archiveProps as prop>
        <#local indexOfSplit = prop?index_of("=") />
        <#local propName= prop?substring(0,indexOfSplit) />
        <#local propValue= prop?substring(indexOfSplit+1) />
        <#switch propName?trim>
            <#case "issueNumber"><#assign archivedIssueNumber = propValue/><#break>
            <#case "issueDate"><#assign archivedIssueDate = propValue/><#break>
            <#case "title"><#assign archivedIssueTitle = propValue/><#break>
            <#case "description"><#assign archivedIssueDescription = propValue/><#break>
            <#case "issueCoverPath"><#assign archivedIssueCoverPath = propValue/><#break>
        </#switch>  

    </#list>
</#compress>
<li class="archivedIssue">
    <a href="/magazine/${archivedIssueNumber}" title="${archivedIssueTitle}"><#if (archivedIssueCoverPath?? && (archivedIssueCoverPath?length > 0) && archivedIssueCoverPath != 'null')>
        <img src="${archivedIssueCoverPath}" alt="${archivedIssueTitle}" title="${archivedIssueTitle}" class="goat" /><#else>
        <img src="/alfresco/nap/webAssets/magazine/_shared/archive/cover-missing.jpg" alt="${archivedIssueTitle}" title="${archivedIssueTitle}" class="camel" /></#if>
        <span class="issueDate">${archivedIssueDate}</span>
    </a>
</li>
</#macro>

<div id="magazineHolder" data-id="${args['issueVersionID']}">

	<#if showArchive == 1>
		<a class="control prev" title="${previousPage}" href="/magazine/${issueNumber}/${totalPages}"><span>&lt;</span></a>
	<#elseif pageNumber == 1>
		<a class="control prev" title="${previousPage}" href="/magazine/${issueNumber}/contents"><span>&lt;</span></a>
	<#elseif showContents == 1>
		<a class="control prev none" title="${previousPage}" href=""><span>&lt;</span></a>
	<#else>
		<a class="control prev" title="${previousPage}" href="/magazine/${issueNumber}/${pageNumber-1}"><span>&lt;</span></a>
	</#if>

	<#if showContents == 1>
		<a class="control next" title="${nextPage}" href="/magazine/${issueNumber}/1"><span>&gt;</span></a>
	<#elseif showArchive == 1>
		<a class="control next none" title="${nextPage}" href=""><span>&gt;</span></a>
	<#elseif pageNumber == totalPages>
		<a class="control next" title="${nextPage}" href="/magazine/${issueNumber}/archive"><span>&gt;</span></a>
	<#else>
		<a class="control next" title="${nextPage}" href="/magazine/${issueNumber}/${pageNumber+1}"><span>&gt;</span></a>
	</#if>

	<div id="magazinePages">

		<ul id="totalIssuePages" style="width: ${carouselWidth?c}px; left:${offset?c}px">

		    ${args['featuresMarkup']}

			<li id="archive" class="page" data-page-number="${totalPages+1}" data-window-title="${archive} | ${magazine}" data-page-title="${archive}" data-feature-title="${archive}" data-status="loaded">
		    	<div id="archiveTop">
					<div id="archiveHeading">
						<h2>${message('magazine.archive')}</h2>
					</div>
				</div>
				<div id="backIssues">
					<ul id="archivedIssues">
						<#if args['archiveItems']?is_string>
							<#assign matched = args.archiveItems?matches("\\{(.*?)\\},?") />
							<#list matched as item>
								${item?replace("\\[?\\s?\\{?issueNumber=([0-9]*), issueDate=(.*?), title=(.*?), issueCoverPath=(.*?), description=(.*?)\\},?\\s?\\]?",'<li class="archivedIssue"><a href="/magazine/$1" title="$3"><img src="$4" alt="$5" title="$3" /><span class="issueDate">$2</span></a></li>',"rism")}
							</#list>
						<#else>
							<#list args['archiveItems'] as item>
								<li class="archivedIssue"><a href="/magazine/${item.issueNumber}" title="${item.title}"><img src="${item.issueCoverPath}" alt="${item.description}" title="${item.title}" /><span class="issueDate">${item.issueDate}</span></a></li>
							</#list>
						</#if>
					</ul>
					<#-- magazine extended archive -->
					<div class="extendedArchive">
                        <a href="/Content/archive/extended">${message('magazine.archive.extended')} ></a>
                    </div>
				</div>		        		
		    </li>
		</ul>
	</div>

	<!-- Table of Contents -->
	<#if (showContents == 1) || (pageNumber > (totalPages + 1)) >
		<div id="contents" data-window-title="${contents} | ${magazine}" data-page-title="${contents}" data-feature-title="${contents}">
	<#else>
		<div id="contents" class="none" data-window-title="${contents} | ${magazine}" data-page-title="${contents}" data-feature-title="${contents}">
	</#if>
	<div id="contentsPageTop">
		<div id="contentsHeading">
			<h2>${message('magazine.contents')} &ndash;</h2>
			<span id="contentsDate">${issueDate?string(message("dateFormat.medium"))}</span>
		</div>
		<div class="clear"></div>
	</div>
	<div id="issue-features">
		${args['contentsPageMarkup']}
	</div>
	</div>
	<div id="magazineLoader">${message('magazine.loading')}</div>
</div>

<!-- Always persistent footer -->
<div id="magazineFooter">
	<ul>
		<li id="magazineFooterLeft">
			<a class="button" id="button-content" href="/magazine/${issueNumber}/contents" title="${contents}"><span>${contents}</span></a>
			<span class="divider"></span>
			<a class="button" id="button-archive" href="/magazine/${issueNumber}/archive" title="${archive}"><span>${archive}</span></a>
		</li>
		<li id="magazineFooterPagecontrols">
			<#if showArchive == 1>
				<a class="prev navButton control" title="${previousPage}" href="/magazine/${issueNumber}/${totalPages}"><span>&lt;</span></a>
			<#elseif pageNumber == 1>
				<a class="prev navButton control" title="${previousPage}" href="/magazine/${issueNumber}/contents"><span>&lt;</span></a>
			<#elseif showContents == 1>
				<a class="prev navButton control none" title="${previousPage}" href=""><span>&lt;</span></a>
			<#else>
				<a class="prev navButton control" title="${previousPage}" href="/magazine/${issueNumber}/${pageNumber-1}"><span>&lt;</span></a>
			</#if>

			<#assign lastMarkerHTML = message('magazine.pageY', '<span class="number">' + totalPages + '</span>') >
			<span id="marker">
				<#if showContents == 1>
					<span id="current"><span class="number">${contents}</span></span>
					<span id="divider" class="none">${message('magazine.pageOf')}</span>
					<span id="last" class="none">${lastMarkerHTML}</span>
				<#elseif showArchive == 1>
					<span id="current"><span class="number">${archive}</span></span>
					<span id="divider" class="none">${message('magazine.pageOf')}</span>
					<span id="last" class="none">${lastMarkerHTML}</span>
				<#else>
					<span id="current">${message('magazine.pageX', '<span class="number">' + pageNumber + '</span>')}</span>
					<span id="divider">${message('magazine.pageOf')}</span>
					<span id="last">${lastMarkerHTML}</span>
				</#if>
			</span>

			<#if showContents == 1>
				<a class="next navButton control" title="${nextPage}" href="/magazine/${issueNumber}/1"><span>&gt;</span></a>
			<#elseif showArchive == 1>
				<a class="next navButton control none" title="${nextPage}" href=""><span>&gt;</span></a>
			<#elseif pageNumber == totalPages>
				<a class="next navButton control" title="${nextPage}" href="/magazine/${issueNumber}/archive"><span>&gt;</span></a>
			<#else>
				<a class="next navButton control" title="${nextPage}" href="/magazine/${issueNumber}/${pageNumber+1}"><span>&gt;</span></a>
			</#if>

		</li>
		<li id="magazineFooterRight">
			<a class="button" id="button-shop" href="${args['shopUrl']}" title="${message('magazine.shopTheMagazine')}"><span>${message('magazine.shopTheMagazine')}</span></a>
			<span class="divider"></span>
			<a class="button" id="button-share" href="mailto:?subject=${shareSubject}&body=${shareBody?url('UTF-8')}" title="${message('magazine.share')}"><span>${message('magazine.share')}</span></a>
		</li>
	</ul>
</div>
		
<script type="text/javascript">

	var issueDate =  new Date("${issueDate?string('MM/dd/yyyy')}");

	magazineLoader.init({
		"pageNumber"	: "${pageNumber}",
		"issueDate"		: issueDate,
		"issueNumber"	: "${issueNumber}",
		"device"		: "${args['device']}",
		"channel"		: "${channel}",
		"language"		: "${language}",
		"debug"			: ${args['debug']}
	})

</script>