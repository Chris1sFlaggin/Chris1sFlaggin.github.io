source "https://rubygems.org"

# Comment out the Jekyll gem
# gem "jekyll", "~> 4.4.1"

# Uncomment the GitHub Pages gem
gem "github-pages", group: :jekyll_plugins

# Theme gem
gem "jekyll-include-cache", group: :jekyll_plugins

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]