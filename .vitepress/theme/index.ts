import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onContentUpdated, useRoute } from 'vitepress';
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import Comment from './components/CommentGiscus.vue'
import { Markmap } from 'markmap-view'

import './custom.css'

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app }) {
        // register global compoment
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Page', Page)
        app.component('Comment', Comment)
    },
    setup() {
        onContentUpdated(() => {
            renderMindmap();
        });
    },
} satisfies Theme


// 渲染思维导图
function renderMindmap() {
    const mindmaps = document.querySelectorAll('.markmap-svg');
    for (const mindmap of mindmaps) {
        const dataJson = mindmap.getAttribute('data-json');
        if (mindmap instanceof SVGElement && dataJson) {
            if (mindmap.children.length > 0) continue;
            const mp = Markmap.create(mindmap, {
                autoFit: true,
                pan: false,
                zoom: false,
            }, JSON.parse(dataJson));
            // 重新设置 SVG 的高度
            setTimeout(() => {
                const width = mp.state.rect.x2 - mp.state.rect.x1; // SVG 的实际宽度
                const height = mp.state.rect.y2 - mp.state.rect.y1; // SVG 的实际高度
                const aspectRatio = height / width; // 高宽比
                // 定义一个子方法用于重新设置 mindmap 的高度
                function setMindmapHeight(mindmap: SVGElement, aspectRatio: number) {
                    const realHeight = mindmap.clientWidth * aspectRatio + 30;
                    mindmap.style.height = `${realHeight}px`;
                    mp.fit()
                }
                // 注册 window 的窗口大小变动事件
                window.addEventListener('resize', () => {
                    setMindmapHeight(mindmap, aspectRatio);
                })
                // 初始设置时调用子方法
                setMindmapHeight(mindmap, aspectRatio);
            }, 0)
        }
    }
}
