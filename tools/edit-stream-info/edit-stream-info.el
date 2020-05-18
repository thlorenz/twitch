;;; edit-stream-info.el --- Edit Twitch Streams -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;; Code:

(require 'org)
(require 'org-element)
(require 'cl-macs)

(defun first--header+content ()
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

(defun first-header+content-buffer ()
  "Get first header and it's content from current buffer."
  (interactive)
  (princ
   (with-current-buffer (current-buffer) (first--header+content))))


(with-temp-buffer
  (insert "
#+TITLE: Twitch Hacks

* Hacking Emacs Lisp

Connecting emacs, elisp, org-mode and twitch.
Learning how to parse org mode.

* Edit Stream Info from CURL Version [0/0]

** Twitch API + CURL [2/3]
:LOGBOOK:
CLOCK: [2020-05-16 Sat 18:37]--[2020-05-16 Sat 19:27] =>  0:50
:END:

- [X] determine curl command to set stream info
- [X] set channel title via curl
- [ ] set live notification via curl scripts

")
  (princ (first-header+content-buffer)))

(provide 'edit-stream-info)
;;; edit-stream-info.el ends here
