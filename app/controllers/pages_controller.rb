class PagesController < ApplicationController
  def home
    @task = Task.new
  end
end
