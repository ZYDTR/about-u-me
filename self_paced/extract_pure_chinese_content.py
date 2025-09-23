#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
心理学词条HTML文件纯中文内容提取脚本
从5个心理学概念的HTML文件中提取纯中文文本内容
"""

import os
import re
from bs4 import BeautifulSoup

def is_chinese_char(char):
    """判断字符是否为中文字符"""
    return '\u4e00' <= char <= '\u9fff'

def is_pure_chinese_text(text):
    """判断文本是否为纯中文内容"""
    if not text or len(text.strip()) < 3:
        return False
    
    text = text.strip()
    
    # 计算中文字符比例
    chinese_chars = sum(1 for char in text if is_chinese_char(char))
    
    # 允许的非中文字符：标点符号、数字、空格、特殊符号
    allowed_non_chinese = r'[\s\d\[\]()（）。，、；：！？""''…—·\-_=\.\,\;\:\!\?\(\)《》【】]'
    
    # 移除允许的非中文字符后，检查剩余字符
    remaining_text = re.sub(allowed_non_chinese, '', text)
    non_chinese_chars = sum(1 for char in remaining_text if not is_chinese_char(char))
    
    # 如果中文字符少于5个，不算纯中文
    if chinese_chars < 5:
        return False
    
    # 如果非中文字母超过10%，不算纯中文
    total_chars = len(text)
    if non_chinese_chars > total_chars * 0.1:
        return False
    
    # 过滤掉明显的英文内容
    english_patterns = [
        r'[a-zA-Z]{3,}',  # 连续英文字母
        r'\b(the|and|of|to|in|for|with|by|from|at|on)\b',  # 常见英文单词
        r'http[s]?://',  # URL
        r'www\.',  # 网址
        r'\.com',  # 域名
    ]
    
    for pattern in english_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return False
    
    return True

def extract_pure_chinese_from_html(html_file_path):
    """从HTML文件提取纯中文内容"""
    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"❌ 读取文件失败 {html_file_path}: {e}")
        return []
    
    try:
        soup = BeautifulSoup(content, 'html.parser')
        
        # 移除script和style标签
        for script in soup(["script", "style"]):
            script.decompose()
        
        pure_chinese_texts = []
        
        # 提取标题中的中文部分
        title = soup.find('title')
        if title:
            title_text = title.get_text().strip()
            # 分割标题，只取中文部分
            if '---' in title_text:
                chinese_part = title_text.split('---')[0].strip()
            elif ' - ' in title_text:
                parts = title_text.split(' - ')
                chinese_part = parts[0].strip()
            else:
                chinese_part = title_text
            
            if is_pure_chinese_text(chinese_part):
                pure_chinese_texts.append(f"【标题】{chinese_part}")
        
        # 提取主要内容区域
        content_selectors = [
            '#mw-content-text',
            '.mw-parser-output',
            'body',
        ]
        
        main_content = None
        for selector in content_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                break
        
        if not main_content:
            main_content = soup
        
        # 提取各种元素的文本
        for element in main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'div', 'span']):
            text = element.get_text().strip()
            
            # 如果包含英文和中文混合，尝试分离
            if text and any(is_chinese_char(c) for c in text):
                # 按句号或换行分割
                sentences = re.split(r'[。\n]', text)
                
                for sentence in sentences:
                    sentence = sentence.strip()
                    if is_pure_chinese_text(sentence):
                        # 清理句子
                        sentence = re.sub(r'\s+', ' ', sentence)  # 压缩空格
                        sentence = re.sub(r'^\d+\.\s*', '', sentence)  # 移除开头数字
                        sentence = re.sub(r'\[\d+\]', '', sentence)  # 移除所有引用标记 [1] [2] 等
                        sentence = re.sub(r'\[citation needed\]', '', sentence)  # 移除citation needed
                        sentence = re.sub(r'\[来源请求\]', '', sentence)  # 移除中文来源请求
                        sentence = re.sub(r'\[需要引用\]', '', sentence)  # 移除需要引用标记
                        sentence = re.sub(r'\[编辑\]', '', sentence)  # 移除编辑标记
                        sentence = re.sub(r'\[edit\]', '', sentence)  # 移除英文编辑标记
                        sentence = sentence.strip()
                        
                        if len(sentence) > 5:  # 只要有意义的句子
                            pure_chinese_texts.append(sentence)
        
        # 去重并过滤
        seen = set()
        filtered_texts = []
        for text in pure_chinese_texts:
            if text not in seen and len(text) > 5:
                seen.add(text)
                filtered_texts.append(text)
        
        return filtered_texts
        
    except Exception as e:
        print(f"❌ 解析HTML失败 {html_file_path}: {e}")
        return []

def main():
    """主函数"""
    print("🚀 开始提取5个心理学词条的纯中文内容...")
    
    # HTML文件列表
    html_files = [
        "resource/DARVO - 维基百科 ---- Wikipedia (2025_9_21 18：07：57).html",
        "resource/习得性失助 - 维基百科，自由的百科全书 (2025_9_21 18：00：32).html", 
        "resource/创伤性结合 - 维基百科 --- Traumatic bonding - Wikipedia (2025_9_21 18：06：55).html",
        "resource/煤气灯效应 - 维基百科，自由的百科全书 (2025_9_21 18：07：39).html",
        "resource/爱情轰炸 - 维基百科 --- Love bombing - Wikipedia (2025_9_21 18：06：27).html"
    ]
    
    # 概念名称映射
    concept_names = {
        "DARVO": "DARVO",
        "习得性失助": "习得性失助",
        "创伤性结合": "创伤性结合", 
        "煤气灯效应": "煤气灯效应",
        "爱情轰炸": "爱情轰炸"
    }
    
    all_chinese_content = []
    all_chinese_content.append("=" * 80)
    all_chinese_content.append("心理学概念纯中文内容提取结果")
    all_chinese_content.append("=" * 80)
    all_chinese_content.append(f"提取时间: {os.popen('date').read().strip()}")
    all_chinese_content.append(f"总文件数: {len(html_files)}")
    all_chinese_content.append("=" * 80)
    all_chinese_content.append("")
    
    total_extracted = 0
    
    for html_file in html_files:
        if not os.path.exists(html_file):
            print(f"❌ 文件不存在: {html_file}")
            continue
            
        print(f"📄 处理文件: {os.path.basename(html_file)}")
        
        # 确定概念名称
        concept_name = "未知概念"
        for key, value in concept_names.items():
            if key in html_file:
                concept_name = value
                break
        
        chinese_texts = extract_pure_chinese_from_html(html_file)
        
        if chinese_texts:
            all_chinese_content.append("=" * 60)
            all_chinese_content.append(f"📚 {concept_name}")
            all_chinese_content.append("=" * 60)
            all_chinese_content.append(f"文件: {os.path.basename(html_file)}")
            all_chinese_content.append(f"纯中文条目数: {len(chinese_texts)}")
            all_chinese_content.append("-" * 40)
            all_chinese_content.append("")
            
            for i, text in enumerate(chinese_texts, 1):
                all_chinese_content.append(f"{i:03d}. {text}")
                all_chinese_content.append("")
            
            total_extracted += len(chinese_texts)
            print(f"✅ 成功提取 {len(chinese_texts)} 条纯中文内容")
        else:
            print(f"⚠️  未找到纯中文内容")
    
    # 写入文件
    output_file = "psychology_concepts_pure_chinese.txt"
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(all_chinese_content))
        
        print(f"\n🎉 纯中文提取完成!")
        print(f"📁 输出文件: {output_file}")
        print(f"📊 总纯中文条目: {total_extracted}")
        print(f"📄 总内容行数: {len(all_chinese_content)}")
        
        # 显示文件大小
        file_size = os.path.getsize(output_file)
        print(f"📏 文件大小: {file_size:,} 字节 ({file_size/1024:.1f} KB)")
        
    except Exception as e:
        print(f"❌ 写入文件失败: {e}")

if __name__ == "__main__":
    main()