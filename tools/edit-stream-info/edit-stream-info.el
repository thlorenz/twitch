;;; edit-stream-info.el --- Edit Twitch Streams -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;; Code:

(require 'org)
(require 'org-element)
(require 'cl-macs)

(defun twitch--edit-stream-first-header+content ()
  "Get first header and it's content from a buffer."
  (let ((bb))
    (block bb
      (org-element-map (org-element-parse-buffer) 'headline
        (lambda (headline)
          (let ((contents-begin (org-element-property :contents-begin headline))
                (contents-end (org-element-property :contents-end headline)))
            (return-from bb
              (list
               (org-element-property :raw-value headline)
               (buffer-substring contents-begin (- contents-end 1))))))))))

(defun twitch--edit-stream-first-header+content-buffer ()
  "Get first header and it's content from current buffer."
  (interactive)
  (with-current-buffer (current-buffer) (twitch--edit-stream-first-header+content)))

;; TESTING
(with-temp-buffer
  (insert "
* Hacking Emacs Lisp

Connecting emacs, elisp, org-mode and twitch.
Learning how to parse org mode.
")
  (twitch--edit-stream-first-header+content))

(provide 'edit-stream-info)

;;; edit-stream-info.el ends here
