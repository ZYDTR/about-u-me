#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
心理学词条HTML文件中文内容提取脚本
从5个心理学概念的HTML文件中提取所有中文文本内容
"""

import os
import re
import glob
from bs4 import BeautifulSoup
from pathlib import Path

def is_chinese_char(char):
    """判断字符是否为中文字符"""
    return '\u4e00' <= char <= '\u9fff'

def extract_chinese_text(text):
    """从文本中提取包含中文的句子和段落"""
    if not text:
        return ""
    
    # 清理文本
    text = text.strip()
    if not text:
        return ""
    
    # 检查是否包含中文字符
    has_chinese = any(is_chinese_char(char) for char in text)
    if not has_chinese:
        return ""
    
    # 过滤掉纯标点符号或过短的文本
    if len(text) < 2:
        return ""
    
    # 过滤掉常见的无意义文本
    skip_patterns = [
        r'^[\s\-_=\.\,\;\:\!\?\(\)\[\]]*$',  # 纯符号
        r'^[0-9\s\-_=\.\,\;\:\!\?\(\)\[\]]*$',  # 纯数字和符号
        r'^[a-zA-Z\s\-_=\.\,\;\:\!\?\(\)\[\]]*$',  # 纯英文和符号
    ]
    
    for pattern in skip_patterns:
        if re.match(pattern, text):
            return ""
    
    return text

def extract_html_chinese_content(html_file_path):
    """从HTML文件提取中文内容"""
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
        
        # 获取所有文本
        all_texts = []
        
        # 提取标题
        title = soup.find('title')
        if title:
            title_text = extract_chinese_text(title.get_text())
            if title_text:
                all_texts.append(f"【标题】{title_text}")
        
        # 提取主要内容区域的文本
        content_selectors = [
            '#mw-content-text',  # 维基百科主内容
            '.mw-parser-output',  # 维基百科解析输出
            'body',  # 备用：整个body
        ]
        
        main_content = None
        for selector in content_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                break
        
        if not main_content:
            main_content = soup
        
        # 提取段落文本
        for element in main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th']):
            text = extract_chinese_text(element.get_text())
            if text and len(text) > 3:  # 过滤太短的文本
                all_texts.append(text)
        
        return all_texts
        
    except Exception as e:
        print(f"❌ 解析HTML失败 {html_file_path}: {e}")
        return []

def main():
    """主函数"""
    print("🚀 开始提取5个心理学词条的中文内容...")
    
    # 查找HTML文件
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
        "习得性失助": "习得性失助 (Learned Helplessness)",
        "创伤性结合": "创伤性结合 (Traumatic Bonding)", 
        "煤气灯效应": "煤气灯效应 (Gaslighting)",
        "爱情轰炸": "爱情轰炸 (Love Bombing)"
    }
    
    all_chinese_content = []
    all_chinese_content.append("=" * 80)
    all_chinese_content.append("心理学概念中文内容提取结果")
    all_chinese_content.append("=" * 80)
    all_chinese_content.append(f"提取时间: {os.popen('date').read().strip()}")
    all_chinese_content.append(f"总文件数: {len(html_files)}")
    all_chinese_content.append("=" * 80)
    all_chinese_content.append("")
    
    extracted_count = 0
    
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
        
        chinese_texts = extract_html_chinese_content(html_file)
        
        if chinese_texts:
            all_chinese_content.append("=" * 60)
            all_chinese_content.append(f"📚 {concept_name}")
            all_chinese_content.append("=" * 60)
            all_chinese_content.append(f"文件: {os.path.basename(html_file)}")
            all_chinese_content.append(f"提取条目数: {len(chinese_texts)}")
            all_chinese_content.append("-" * 40)
            all_chinese_content.append("")
            
            for i, text in enumerate(chinese_texts, 1):
                all_chinese_content.append(f"{i:03d}. {text}")
                all_chinese_content.append("")
            
            extracted_count += 1
            print(f"✅ 成功提取 {len(chinese_texts)} 条中文内容")
        else:
            print(f"⚠️  未找到中文内容")
    
    # 写入文件
    output_file = "psychology_concepts_chinese_content.txt"
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(all_chinese_content))
        
        print(f"\n🎉 提取完成!")
        print(f"📁 输出文件: {output_file}")
        print(f"📊 成功处理: {extracted_count}/{len(html_files)} 个文件")
        print(f"📄 总内容行数: {len(all_chinese_content)}")
        
        # 显示文件大小
        file_size = os.path.getsize(output_file)
        print(f"📏 文件大小: {file_size:,} 字节 ({file_size/1024:.1f} KB)")
        
    except Exception as e:
        print(f"❌ 写入文件失败: {e}")

if __name__ == "__main__":
    main()