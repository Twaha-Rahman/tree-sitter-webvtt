; Only highlight the first few line_with_terminator in style blocks
(style_block
  (css_style) @injection.content
  (#set! injection.language "css"))
