#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理txt文件中的引用标记和无用内容
"""

import re

def clean_text_content(input_file, output_file):
    """清理文本文件中的引用和无用内容"""
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 读取文件失败: {e}")
        return
    
    lines = content.split('\n')
    cleaned_lines = []
    
    for line in lines:
        original_line = line
        
        # 跳过完全是引用标记的行
        if re.match(r'^\d+\.\s*\[\d+\]\s*$', line.strip()):
            continue
            
        # 清理各种引用标记
        line = re.sub(r'\[\d+\]', '', line)  # 移除 [1] [2] 等数字引用
        line = re.sub(r'\[citation needed\]', '', line)  # 移除citation needed
        line = re.sub(r'\[来源请求\]', '', line)  # 移除中文来源请求
        line = re.sub(r'\[需要引用\]', '', line)  # 移除需要引用标记
        line = re.sub(r'\[编辑\]', '', line)  # 移除编辑标记
        line = re.sub(r'\[edit\]', '', line)  # 移除英文编辑标记
        line = re.sub(r'\[页面存档备份.*?\]', '', line)  # 移除页面存档备份
        line = re.sub(r'\[.*?存档.*?\]', '', line)  # 移除各种存档标记
        
        # 清理特殊符号和多余空格
        line = re.sub(r'\s+', ' ', line)  # 压缩多个空格
        line = line.strip()
        
        # 过滤明显的无用行
        skip_patterns = [
            r'^[\d\.\s]*$',  # 纯数字和点
            r'^[编辑查看历史]+$',  # 编辑查看历史
            r'^展开.*?编$',  # 展开xxx编
            r'^折叠.*?编$',  # 折叠xxx编  
            r'^查论编',  # 查论编
            r'^请检查.*?日期值',  # 请检查日期值
            r'^引文格式.*?维护',  # 引文格式维护
            r'^\([年月日\s\d]+\)$',  # 纯日期括号
            r'^分类：',  # 分类标记
            r'^标签：',  # 标签标记
        ]
        
        should_skip = False
        for pattern in skip_patterns:
            if re.match(pattern, line):
                should_skip = True
                break
        
        if should_skip:
            continue
            
        # 过滤太短或空的行（但保留分割线和标题）
        if len(line) < 3 and not line.startswith('=') and not line.startswith('-') and not line.startswith('📚'):
            continue
            
        # 如果行变化了，说明清理了内容
        if line != original_line.strip():
            print(f"清理: {original_line.strip()[:50]}...")
            
        cleaned_lines.append(line)
    
    # 移除连续的空行
    final_lines = []
    prev_empty = False
    
    for line in cleaned_lines:
        if line == '':
            if not prev_empty:
                final_lines.append(line)
            prev_empty = True
        else:
            final_lines.append(line)
            prev_empty = False
    
    # 写入清理后的文件
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(final_lines))
        
        print(f"\n✅ 清理完成!")
        print(f"📁 原文件: {input_file}")
        print(f"📁 清理后文件: {output_file}")
        print(f"📊 原始行数: {len(content.split('\n'))}")
        print(f"📊 清理后行数: {len(final_lines)}")
        
        # 显示文件大小对比
        import os
        original_size = os.path.getsize(input_file)
        cleaned_size = os.path.getsize(output_file)
        print(f"📏 原始大小: {original_size:,} 字节")
        print(f"📏 清理后大小: {cleaned_size:,} 字节")
        print(f"📉 减少: {original_size - cleaned_size:,} 字节 ({(original_size - cleaned_size)/original_size*100:.1f}%)")
        
    except Exception as e:
        print(f"❌ 写入文件失败: {e}")

if __name__ == "__main__":
    print("🧹 开始清理引用标记和无用内容...")
    
    input_file = "psychology_concepts_pure_chinese.txt"
    output_file = "psychology_concepts_cleaned.txt"
    
    clean_text_content(input_file, output_file)