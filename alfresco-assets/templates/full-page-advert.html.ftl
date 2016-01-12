<#assign FLTFile= companyhome.childByNamePath["Sites/alfrescoContent/documentLibrary/nap/templates/globalFunctions/functions.ftl"] > 
<#include "${FLTFile.nodeRef}" >

<#assign channelSuffix = "opuk">
<#assign issueVersionNode = companyhome.nodeByReference["workspace://SpacesStore/" + args["issueVersionID"]] > 
<#if issueVersionNode?exists>
	<#assign channel = issueVersionNode.properties['napb:channel']?lower_case >
        <#assign language = issueVersionNode.properties['napb:language']?lower_case > 
	<#switch channel>
		<#case "am">
			<#assign channelSuffix = "opus">
			<#break>
		<#case "intl">
			<#break>
		<#case "apac">
			<#break>
	</#switch>
</#if>

<#assign blockID><#compress>
<@templateBlockContent templateBlock=space contentName="block-id.txt" />
</#compress></#assign>
<iframe scrolling="no" width="950" height="624" style="border:0 transparent none;" src="http://www.net-a-porter.com/Content/notemplate/jsMagazineAdverts?marketingChannel=${channelSuffix}&blockID=${blockID}&language=${language}&exclude=true"></iframe>