<a class="feature" href="/magazine/${args['issueNumber']}/${args['pageNumber']}" onclick="return magazineBuilder.jumpToPage(${args['pageNumber']})" title="${args['title']}">
	<#if args['pageImage']?exists>
		<img src="${args['imgUrl']}/${document.name}" alt="${args['title']}" />
	<#else>
		<img src="/alfresco/nap/webAssets/magazine/_shared/contents/cover-missing.jpg" alt="${args['title']}" />
	</#if>
	<span class="featureTitle">${args['title']}</span>
</a>