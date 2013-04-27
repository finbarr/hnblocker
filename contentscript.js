var storage = chrome.storage.local;
var blockedUsers;

function commentLinkSelector(userName) {
  return 'span.comhead a[href="user?id=' + userName + '"]';
}

function findComments(userName) {
  return $(commentLinkSelector(userName)).closest('td.default');
}

function processComment(comment, visible) {
  var $comment = $(comment);
  var $children = $comment.children();
  var $comhead = $children.first().children().first();
  var $content = $children.first().nextAll();
  var $a;
  var $commenter = $comhead.children().first();

  if(!$comment.data('processed')) {
    $comhead.append(' | <a href="#"></a>');
    $comment.data('processed', true);

    var userName = $comhead.children().first().text();
    $a = $comhead.children().last();

    $a.click(function() {
      toggleUser(userName);
      return false;
    });
  } else {
    $a = $comhead.children().last();
  }

  if(visible) {
    $a.text('block');
    $commenter.css({textDecoration: 'none'});
    $content.show();
  } else {
    $a.text('unblock');
    $commenter.css({textDecoration: 'line-through'});
    $content.hide();
  }
}

function toggleUser(userName) {
  if(blockedUsers[userName]) {
    unblockUser(userName);
  } else {
    blockUser(userName);
  }
}

function hideComment() {
  processComment(this, false);
}

function hideComments(userName) {
  findComments(userName).each(hideComment);
}

function showComment() {
  processComment(this, true);
}

function showComments(userName) {
  findComments(userName).each(showComment);
}

function blockUser(userName) {
  blockedUsers[userName] = 1;
  o = {};
  o[userName] = 1;
  storage.set(o);
  hideComments(userName);
}

function unblockUser(userName) {
  delete blockedUsers[userName];
  storage.remove(userName);
  showComments(userName);
}

function processComments() {
  $('span.comhead a[href^="user"]').each(function() {
    var $a = $(this);
    var $comment = $a.closest('td.default').first();
    var userId = $a.text();

    if(blockedUsers[userId]) {
      hideComment.apply($comment);
    } else {
      showComment.apply($comment);
    }
  });
}

storage.get(function(data) {
  blockedUsers = data || {};
  $(processComments);
});
