; Only highlight the first few line_with_terminator in style blocks
(style_block
  (text_including_terminator) @injection.content
  (#set! injection.language "css"))
