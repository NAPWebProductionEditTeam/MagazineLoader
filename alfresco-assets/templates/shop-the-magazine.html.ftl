<#-- reference to global functions [Required to run macros] -->
<#assign FLTFile= companyhome.childByNamePath["Sites/alfrescoContent/documentLibrary/nap/templates/globalFunctions/functions.ftl"] > 
<#include "${FLTFile.nodeRef}" > 

<div id="shopTheMagazine">
	<a href="${args['shopUrl']}" title="Shop The Magazine">
		<@templateBlockContent templateBlock=space contentName="shop.html"/>
	</a>
</div>