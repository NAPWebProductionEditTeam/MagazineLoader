<li class="archivedIssue">
	<a href="/magazine/${args['issueNumber']}" title="${args['title']}">
		<#if args['issueCover']?exists>
			<img src="${args['imgUrl']}/${document.name}" alt="${args['title']}"/>
		<#else>
			<img src="/alfresco/nap/webAssets/magazine/_shared/archive/cover-missing.jpg" alt="${args['title']}" />
		</#if>
		<span class="issueDate">${args['issueDate']}</span>
	</a>	
</li>