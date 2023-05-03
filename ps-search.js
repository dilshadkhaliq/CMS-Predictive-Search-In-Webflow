function ps_search() {
    $("[ps-element^='wrapper']").each(function () {
      let elem = $(this);
      let doc = $(document);
      let searchInput = elem.find("[ps-element='input']");
      let searchResultWrapper = elem.find("[ps-element='result']");
      let searchForm = elem.find("form");
  
      let activeInputClass = elem.attr("ps-input-active") || "active-input";
      let activeItemClass = elem.attr("ps-item-active") || "active-item";
      let searchTigger = elem.attr("ps-search-trigger") || "focus";
      let searchType = elem.attr("ps-search-type") || "page";
      let searchFilterURL = elem.attr("ps-search-filter-url");
  
      searchInput.attr("autocomplete", "off");
      searchInput.css("pointer-events", "auto");
  
      if (searchTigger == "input") {
        //search on input
        searchInput.on("input", function () {
          $(this).addClass(activeInputClass);
          searchResultWrapper.show();
          console.log("On Input get trigger");
        });
      }
  
      //search on focus
      searchInput.on("focus", function () {
        if (searchTigger == "focus") {
          $(this).addClass(activeInputClass);
          searchResultWrapper.show();
        }
  
        doc.bind("keydown", { input: $(this) }, upOrDownKey);
        doc.bind("mousedown", { input: $(this) }, mouseDown);
      });
  
      searchInput.on("blur", function () {
        $(this).removeClass(activeInputClass);
        searchResultWrapper.hide();
  
        doc.unbind("keydown", upOrDownKey);
        doc.unbind("mousedown", mouseDown);
      });
  
      //disable form submission on Enter and redirect configuration
      searchForm.on("keydown", function (e) {
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          e.preventDefault();
          console.log(searchType);
          //search type
          searchType === "page" ? redirectPage($(this)) : redirectPage($(this), true);
  
          return false;
        }
      });
  
      function mouseDown(e) {
        let formWrapper = e.data.input.closest(elem);
        if (!e.data.input.is(e.target) && e.data.input.is(":focus") && (formWrapper.is(e.target) || formWrapper.has(e.target).length)) {
          e.preventDefault();
        }
      }
      function upOrDownKey(e) {
        let keyCode = e.keyCode || e.which;
        let renderedItems = e.data.input.closest(elem).find(".w-dyn-item");
  
        if (keyCode == 40) {
          selectNextItems(renderedItems, e.data.input);
        } else if (keyCode == 38) {
          selectPrevItems(renderedItems, e.data.input);
        } else {
          renderedItems.removeClass(activeItemClass);
        }
      }
      function selectNextItems(items, searchInput) {
        if (items.hasClass(activeItemClass)) {
          let currentActive = items.filter("." + activeItemClass);
          let nextElt = currentActive.next();
          if (nextElt.length) {
            currentActive.removeClass(activeItemClass);
            nextElt.addClass(activeItemClass);
            searchInput.val(nextElt.text());
          }
        } else {
          items.first().addClass(activeItemClass);
          searchInput.val(items.first().text());
        }
      }
      function selectPrevItems(items, searchInput) {
        if (items.hasClass(activeItemClass)) {
          let currentActive = items.filter("." + activeItemClass);
          let prevElt = currentActive.prev();
          if (prevElt.length) {
            currentActive.removeClass(activeItemClass);
            prevElt.addClass(activeItemClass);
            searchInput.val(prevElt.text());
          }
        } else {
          items.last().addClass(activeItemClass);
          searchInput.val(items.last().text());
        }
      }
      function redirectPage(form, filterURL = false) {
        let filteredItem = form.closest(elem).find(".w-dyn-item");
  
        if (filteredItem.length) {
          if (filterURL) {
            createFilterURL(filteredItem);
          }
          let activeItem = filteredItem.filter("." + activeItemClass);
          if (activeItem.length) {
            let redirectURL = activeItem.find("a").attr("href");
            if (redirectURL) {
              form.children("input").val("");
              window.location.href = redirectURL;
            }
          } else {
            let redirectURL = filteredItem.first().find("a").attr("href");
            if (redirectURL) {
              form.children("input").val("");
              window.location.href = redirectURL;
            }
          }
        }
      }
      function createFilterURL(filteredItem) {
        if (searchFilterURL) {
          filteredItem.each(function () {
            let field = $(this).find("[fs-cmsfilter-field]");
            let paraName = field.attr("fs-cmsfilter-field");
            let paraval = field.text();
            let redirectURL = searchFilterURL.replace(/\/$/, "") + "?" + paraName + "=" + paraval;
            $(this).find("a").attr("href", redirectURL);
          });
        }
      }
    });
  }
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    (filterInstances) => {
      ps_search();
    }
  ]);
  