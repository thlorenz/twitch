;;; edit-stream-info.el --- Edit Twitch Streams -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;; Code:

(require 'org)
(require 'org-element)
(require 'cl-macs)

(defun tt-heading-description ()
  "Get header and description of first header element in buffer."
  (with-temp-buffer
    (insert "
* Top Heading

Some description

* Second Heading

Other description
")
    (interactive)
    (block tt-heading-description
      (org-element-map (org-element-parse-buffer) 'headline
        (lambda (headline)
          (let ((contents-begin (org-element-property :contents-begin headline))
                (contents-end (org-element-property :contents-end headline)))
            (return-from tt-heading-description (list
                                                 (org-element-property :raw-value headline)
                                                 (buffer-substring contents-begin (- contents-end 1))))))))))
(tt-heading-description)

(provide 'edit-stream-info)
;;; edit-stream-info.el ends here
