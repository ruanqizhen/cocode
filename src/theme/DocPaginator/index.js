import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

export default function DocPaginatorWrapper(props) {
	const { colorMode } = useColorMode();
	return (
		<>
			<DocPaginator {...props} />
			<br />
			<Giscus
				repo='ruanqizhen/cocode'
				repoId='R_kgDOSm0Rhg'
				category='Announcements'
				categoryId='DIC_kwDOSm0Rhs4C9xJS'
				mapping='pathname'
				strict='1'
				reactionsEnabled='1'
				emitMetadata='1'
				inputPosition='top'
				theme={colorMode}
				lang='zh-CN'
				loading="lazy"
			/>
		</>
	);
}
